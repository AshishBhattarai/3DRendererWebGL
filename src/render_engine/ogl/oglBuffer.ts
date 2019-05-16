import { gl } from "./oglGlobals";

export enum OGLBufferType {
  ARRAY_BUFFER = WebGL2RenderingContext.ARRAY_BUFFER,
  UNIFORM_BUFFER = WebGL2RenderingContext.UNIFORM_BUFFER
}

export default class OGLBuffer {
  private id: WebGLBuffer;
  private type: GLenum;

  constructor(type = OGLBufferType.ARRAY_BUFFER) {
    this.type = type;
    this.id = gl.createBuffer();
  }

  public bufferData(
    dataOrSize: Float32Array | Int32Array | Uint32Array | number
  ) {
    gl.bufferData(this.type, dataOrSize, gl.STATIC_DRAW);
  }

  public bind() {
    gl.bindBuffer(this.type, this.id);
  }

  public unBind() {
    gl.bindBuffer(this.type, null);
  }

  public getId(): WebGLBuffer {
    return this.id;
  }

  public release() {
    gl.deleteBuffer(this.id);
  }
}
