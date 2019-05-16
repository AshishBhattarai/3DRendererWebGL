import { vec2, mat4, vec3 } from "gl-matrix";
import Mesh, { MeshFlags } from "../model/mesh";
import Material from "../model/material";
import { MaterialShader } from "../shader/shader_config";
import { gl } from "../ogl/oglGlobals";
import Texture, { TextureType } from "../model/texture";

export default class Terrain {
  static readonly VERTEX_CNT = 20;
  static readonly SIZE = 500;
  static readonly TILING_FACTOR = 50;

  public position: vec2;
  private size: number;
  private vertexCount: number;
  private tilingFactor: number;

  private mesh: Mesh;
  public material: Material;

  constructor(
    gridPos: vec2,
    size: number = Terrain.SIZE,
    vertexCount: number = Terrain.VERTEX_CNT,
    tilingFactor: number = Terrain.TILING_FACTOR
  ) {
    this.position = vec2.create();
    this.vertexCount = vertexCount;
    this.size = size;
    this.tilingFactor = tilingFactor;
    vec2.scale(this.position, gridPos, this.size);

    this.generateTerrain();

    this.material = new Material({
      materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
    });

    let image = new Image();
    image.onload = () => {
      this.material.diffuseMap = new Texture(image, TextureType.DEFAULT_MAP);
      this.material.diffuseMap.setTextureWrap(gl.REPEAT);
    };
    image.src = "res/grass.png";
  }

  private generateTerrain() {
    var vertices: number[] = [];
    var texCoords: number[] = [];
    var normals: number[] = [];
    var indices: number[] = [];

    for (let z = 0; z < this.vertexCount; ++z) {
      for (let x = 0; x < this.vertexCount; ++x) {
        // position
        vertices.push(-(x / (this.vertexCount - 1)) * this.size);
        vertices.push(0.0);
        vertices.push(-(z / (this.vertexCount - 1)) * this.size);
        // normal
        normals.push(0.0, 1.0, 0.0);
        // texture coords
        texCoords.push((x / (this.vertexCount - 1)) * this.tilingFactor);
        texCoords.push((z / (this.vertexCount - 1)) * this.tilingFactor);
        // indices
        if (z < this.vertexCount - 1) {
          indices.push(z * this.vertexCount + x);
          indices.push((z + 1) * this.vertexCount + x);
        }
      }
      if (z < this.vertexCount - 2) {
        indices.push((z + 1) * this.vertexCount + (this.vertexCount - 1));
        indices.push((z + 1) * this.vertexCount);
      }
    }
    console.log(vertices.length + " " + normals.length);
    this.mesh = new Mesh({
      vertexData: new Float32Array(vertices),
      normalData: new Float32Array(normals),
      indexData: new Uint32Array(indices),
      uvData: new Float32Array(texCoords)
    });
    this.mesh.setFlags(this.mesh.getFlags() | MeshFlags.TERRAIN);
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
