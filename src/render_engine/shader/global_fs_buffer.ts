import UniformBuffer from "./uniform_buffer";
import { vec3 } from "gl-matrix";

export default class GlobalFSBuffer extends UniformBuffer {
  // align offsets
  private static readonly FOG_COLOR_OFFSET = 0;
  private static readonly SUN_COLOR_OFFSET = UniformBuffer.SIZE_VEC4;
  private static readonly SCENE_AMBIENT_OFFSET =
    GlobalFSBuffer.SUN_COLOR_OFFSET + UniformBuffer.SIZE_VEC4;

  private static readonly TOTAL_SIZE =
    GlobalFSBuffer.SCENE_AMBIENT_OFFSET + UniformBuffer.SIZE_BAISC;

  constructor() {
    super(GlobalFSBuffer.TOTAL_SIZE);
  }

  public setFogColor(color: vec3) {
    this.setBufferData(color, GlobalFSBuffer.FOG_COLOR_OFFSET);
  }

  public setSunColor(color: vec3) {
    this.setBufferData(color, GlobalFSBuffer.SUN_COLOR_OFFSET);
  }

  public setSceneAmbient(value: number) {
    this.setBufferData(
      new Float32Array([value]),
      GlobalFSBuffer.SCENE_AMBIENT_OFFSET
    );
  }
}
