import { ShaderConfig } from "../shader/shader_config";
import OGLVertexArray, { DrawMode } from "../ogl/oglVertexArray";

export interface IMesh {
  vertexData: Float32Array;
  normalData: Float32Array;
  indexData: Uint32Array;
  uvData?: Float32Array;
  boneIds?: Uint32Array;
  weightData?: Float32Array;
}

export enum MeshFlags {
  NONE = 0,
  DEFAULT = 1 << 0,
  TERRAIN = 1 << 1,
  UV = 1 << 2,
  RIGGED = 1 << 3
}

export default class Mesh {
  private index_cnt: number = 0;
  private vao: OGLVertexArray;
  private drawMode: DrawMode;
  private flags: MeshFlags;

  constructor(iMesh: IMesh) {
    var flags = MeshFlags.NONE;
    this.vao = new OGLVertexArray();
    this.vao.bind();
    this.vao.createAttribute(ShaderConfig.VERTEX_LOC, 3, iMesh.vertexData);
    this.vao.createAttribute(ShaderConfig.NORMAL_LOC, 3, iMesh.normalData);
    if (iMesh.uvData) {
      this.vao.createAttribute(ShaderConfig.UV_LOC, 2, iMesh.uvData);
      this.flags |= MeshFlags.UV;
    }
    if (iMesh.boneIds) {
      this.vao.createAttribute(ShaderConfig.BONE_ID_LOC, 4, iMesh.boneIds);
      this.vao.createAttribute(ShaderConfig.WEIGHT_LOC, 4, iMesh.weightData);
      this.flags |= MeshFlags.RIGGED;
    }
    this.vao.createIndex(iMesh.indexData);
    this.vao.enableAttribs();
    this.vao.unBind();
    this.vao.unBindIndex();
    this.index_cnt = this.vao.getIndexCount();
    this.setFlags(flags);
  }

  public bindMesh(): void {
    this.vao.bind();
  }

  public drawMesh(): void {
    this.vao.draw(this.drawMode);
  }

  public setFlags(flags: MeshFlags): void {
    if (flags & MeshFlags.TERRAIN) this.drawMode = DrawMode.TRIANGLE_STRIP;
    else this.drawMode = DrawMode.TRIANGLES;
    this.flags = flags;
  }

  public getFlags(): MeshFlags {
    return this.flags;
  }

  public release(): void {
    if (this.flags & MeshFlags.DEFAULT) return;
    this.vao.release();
  }
}
