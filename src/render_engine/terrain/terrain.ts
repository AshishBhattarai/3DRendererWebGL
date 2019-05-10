import { vec2, mat4, vec3 } from "gl-matrix";
import Mesh, { ModelType } from "../model/mesh";
import Material from "../model/material";
import LitTextureShader from "../shader/lit_texture_shader";
import { MaterialShader } from "../shader/shader_config";

export default class Terrain {
  static readonly VERTEX_CNT = 20;
  static readonly SIZE = 100;

  private position: vec2;
  private size: number;
  private vertexCount: number;

  private mesh: Mesh;
  private material: Material;

  constructor(
    gridPos: vec2,
    size: number = Terrain.SIZE,
    vertexCount: number = Terrain.VERTEX_CNT
  ) {
    this.position = vec2.create();
    this.vertexCount = vertexCount;
    this.size = size;
    vec2.scale(this.position, gridPos, this.size);

    this.generateTerrain();

    this.material = new Material({
      materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
    });
  }

  private generateTerrain() {
    var vertices: number[] = [];
    var texCoords: number[] = [];
    var normals: number[] = [];
    var indices: number[] = [];

    for (let z = 0; z < this.vertexCount; ++z) {
      for (let x = 0; x < this.vertexCount; ++x) {
        // position
        vertices.push((x / (this.vertexCount - 1)) * this.size);
        vertices.push(0.0);
        vertices.push((z / (this.vertexCount - 1)) * this.size);
        // normal
        normals.push(0.0, 1.0, 0.0);
        // texture coords
        texCoords.push(x / (this.vertexCount - 1));
        texCoords.push(z / (this.vertexCount - 1));
        // indices
        if (z < this.vertexCount - 1) {
          indices.push(z * this.vertexCount + x);
          indices.push((z + 1) * this.vertexCount + x);
        }
      }
      if (z < this.vertexCount - 3) {
        indices.push((z + 1) * this.vertexCount + (this.vertexCount - 1));
        indices.push((z + 1) * this.vertexCount);
      }
    }
    console.log(vertices.length + " " + normals.length);
    this.mesh = new Mesh(
      {
        vertexData: new Float32Array(vertices),
        normalData: new Float32Array(normals),
        indexData: new Uint32Array(indices),
        uvData: new Float32Array(texCoords)
      },
      ModelType.TERRAIN
    );
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public getMaterial(): Material {
    return this.material;
  }

  public getTransMat(): mat4 {
    var transMat = mat4.create();
    var pos = vec3.fromValues(this.position[0], 0.0, this.position[1]);
    mat4.translate(transMat, transMat, pos);
    return transMat;
  }
}
