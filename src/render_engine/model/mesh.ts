import { gl } from "../ogl_globals";
import { ShaderConfig } from "../shader/shader_config";

export interface IMesh {
  vertexData: Float32Array;
  normalData: Float32Array;
  indexData: Uint32Array;
  uvData?: Float32Array;
}

export enum ModelType {
  NONE,
  DEFAULT
}

export default class Mesh {
  private index_cnt: number = 0;

  protected vao: WebGLVertexArrayObject;
  private vertexBuffer: WebGLBuffer;
  private normalBuffer: WebGLBuffer;
  private indexBuffer: WebGLBuffer;
  private uvBuffer: WebGLBuffer;

  private type: ModelType;

  constructor(iMesh: IMesh, type: ModelType = ModelType.NONE) {
    this.index_cnt = iMesh.indexData.length;
    this.type = type;
    this.createBuffer();

    gl.bindVertexArray(this.vao);

    //TODO: this(enable attrib) on main renderer -> render_engine.ts
    gl.enableVertexAttribArray(ShaderConfig.VERTEX_LOC);
    gl.enableVertexAttribArray(ShaderConfig.NORMAL_LOC);
    gl.enableVertexAttribArray(ShaderConfig.UV_LOC);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, iMesh.vertexData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(ShaderConfig.VERTEX_LOC, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, iMesh.normalData, gl.STATIC_DRAW);
    gl.vertexAttribPointer(ShaderConfig.NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);

    if (iMesh.uvData) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, iMesh.uvData, gl.STATIC_DRAW);
      gl.vertexAttribPointer(ShaderConfig.UV_LOC, 2, gl.FLOAT, false, 0, 0);
    } else {
      gl.deleteBuffer(this.uvBuffer);
      this.uvBuffer = null;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, iMesh.indexData, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  private createBuffer(): void {
    this.vao = gl.createVertexArray();
    this.vertexBuffer = gl.createBuffer();
    this.normalBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
  }

  public drawMesh(): void {
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.index_cnt, gl.UNSIGNED_INT, 0);
  }

  public release(): void {
    if ((this.type = ModelType.DEFAULT)) return;

    gl.deleteBuffer(this.vertexBuffer);
    gl.deleteBuffer(this.normalBuffer);
    gl.deleteBuffer(this.indexBuffer);
    if (this.uvBuffer) gl.deleteBuffer(this.uvBuffer);
    gl.deleteVertexArray(this.vao);

    this.vertexBuffer = null;
    this.normalBuffer = null;
    this.indexBuffer = null;
    this.uvBuffer = null;
    this.vao = null;
  }
}
