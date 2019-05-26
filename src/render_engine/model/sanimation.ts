import KeyFrame from "./KeyFrame";

export default class SAnimation {
  private readonly name: string;
  private readonly duration: number;
  private readonly boneAnimations: Map<string, KeyFrame[]>;

  /**
   * @param
   * 	1) duration - Animation duration in milliseconds.
   * 	2) boneAnimations - Map of bone name and bone keyframes
   */
  constructor(
    name: string,
    duration: number,
    boneAnimations: Map<string, KeyFrame[]>
  ) {
    this.name = name;
    this.duration = duration;
    this.boneAnimations = boneAnimations;
  }

  public getName(): string {
    return this.name;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getBoneAnimations(): Map<string, KeyFrame[]> {
    return this.boneAnimations;
  }
}
