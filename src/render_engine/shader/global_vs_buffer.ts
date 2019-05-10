import UniformBuffer from "./uniform_buffer";
import { mat4, vec3, vec4 } from "gl-matrix";

export default class GlobalVSBuffer extends UniformBuffer {
  // aligned offsets
  private static readonly PROJECTION_MAT_OFFSET = 0;
  private static readonly VIEW_MAT_OFFSET = UniformBuffer.SIZE_MATRIX4;
  private static readonly CAMERA_POS_OFFSET = 2 * UniformBuffer.SIZE_MATRIX4;
  private static readonly SUN_POS_OFFSET =
    GlobalVSBuffer.CAMERA_POS_OFFSET + UniformBuffer.SIZE_VEC4;

  private static readonly TOTAL_SIZE =
    GlobalVSBuffer.SUN_POS_OFFSET + UniformBuffer.SIZE_VEC4;

  constructor() {
    super(GlobalVSBuffer.TOTAL_SIZE);
  }

  public setViewMatrix(mat: mat4) {
    this.setBufferData(mat, GlobalVSBuffer.VIEW_MAT_OFFSET);
  }

  public setProjectionMatrix(mat: mat4) {
    this.setBufferData(mat, GlobalVSBuffer.PROJECTION_MAT_OFFSET);
  }

  public setCameraPosition(pos: vec3) {
    this.setBufferData(pos, GlobalVSBuffer.CAMERA_POS_OFFSET);
  }

  public setSunPosition(pos: vec3) {
    this.setBufferData(pos, GlobalVSBuffer.SUN_POS_OFFSET);
  }
}
