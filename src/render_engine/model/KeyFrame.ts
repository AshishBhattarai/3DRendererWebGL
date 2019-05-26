import BoneTransform from "./bone_transform";

export default class KeyFrame {
  private readonly timeStamp: number;
  private readonly boneTransform: BoneTransform;

  /**
   * @param
   * 	1) timeStamp - Time in the animtion when this keyframe
   * 	2) boneTransform - transform for the bone at this keyframe
   */
  constructor(timeStamp: number, boneTranform: BoneTransform) {
    this.timeStamp = timeStamp;
    this.boneTransform = boneTranform;
  }

  public getTimeStamp(): number {
    return this.timeStamp;
  }

  public getBoneTransform(): BoneTransform {
    return this.boneTransform;
  }
}
