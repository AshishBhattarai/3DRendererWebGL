import { vec3, quat, mat4 } from "gl-matrix";

export default class BoneTransform {
  private readonly position: vec3;
  private readonly rotation: quat;

  constructor(position: vec3, rotation: quat) {
    this.position = position;
    this.rotation = rotation;
  }

  /**
   * Get bone-space transformation
   */
  public getLocalTransform(): mat4 {
    var transform = mat4.create();
    mat4.translate(transform, transform, this.position);
    mat4.multiply(
      transform,
      mat4.fromQuat(mat4.create(), this.rotation),
      transform
    );
    return transform;
  }

  /**
   * Interpolate between two BoneTransform based on progress
	 * @returns - Interpolated BoneTransform
   */
  public static interpolate(
    frameA: BoneTransform,
    frameB: BoneTransform,
    progress: number
  ): BoneTransform {
    var pos = this.vec3Interpolate(frameA.position, frameB.position, progress);
    var rot = quat.slerp(
      quat.create(),
      frameA.rotation,
      frameB.rotation,
      progress
    );
    return new BoneTransform(pos, rot);
  }

  private static vec3Interpolate(start: vec3, end: vec3, progress: number): vec3 {
    var x = start[0] * (1 - progress) + end[0] * progress;
    var y = start[1] * (1 - progress) + end[1] * progress;
    var z = start[2] * (1 - progress) + end[2] * progress;
    return vec3.fromValues(x, y, z);
  }
}
