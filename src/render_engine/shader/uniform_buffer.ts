import { gl } from "../ogl_globals";

export default class UniformBuffer {
  // Constant base alignments, aligned offset must be multiple of base alignment
  static readonly SIZE_BAISC = 4;
  static readonly SIZE_VEC2 = 8;
  static readonly SIZE_VEC4 = 16;
  static readonly SIZE_MATRIX4 = 4 * UniformBuffer.SIZE_VEC4;
  static readonly SIZE_MATRIX3 = 3 * UniformBuffer.SIZE_VEC4;

  private ubo: WebGLBuffer;
  private total_size: number;
  private bindingPoint: number;
  private static usedBindingPoint: number = 0;

  constructor(total_size: number) {
    this.total_size = total_size;
    this.ubo = gl.createBuffer();

    gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
    gl.bufferData(gl.UNIFORM_BUFFER, total_size, gl.STREAM_DRAW);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);

    this.bindingPoint = UniformBuffer.usedBindingPoint++;
    gl.bindBufferBase(gl.UNIFORM_BUFFER, this.bindingPoint, this.ubo);
  }

  protected setBufferData(data: Float32Array, offset: number): void {
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.ubo);
    gl.bufferSubData(gl.UNIFORM_BUFFER, offset, data);
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
  }

  public getBindingPoint(): number {
    return this.bindingPoint;
  }

  public release() {
    gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    gl.deleteBuffer(this.ubo);
  }
}
