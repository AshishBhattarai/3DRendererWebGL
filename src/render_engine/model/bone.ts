import { mat4 } from "gl-matrix";

export default class Bone {
  private id: number;
  private name: string;
  private children: Bone[] = [];
  public animTransform: mat4; // tranform in model space + animation

  private localPoseTransform: mat4; // bone transform(pose) in relation to its parent
  private inverseModelPoseTransform: mat4; // inverse of bone transform in model space

  constructor(id: number, name: string, localPoseTranform: mat4) {
    this.id = id;
    this.name = name;
    this.localPoseTransform = localPoseTranform;
  }

  /**
   * Caclculates inverse model space bones transform for a pose
   *
   * Should only be called from root bone after all bones are loaded.
   */
  private calculateInverseModelPoseTransform(
    parentModelPoseTransform: mat4
  ): void {
    var modelPoseTransform = mat4.create();
    // calculate model space bone transformation
    mat4.mul(
      modelPoseTransform,
      parentModelPoseTransform,
      this.localPoseTransform
    );
    mat4.invert(this.inverseModelPoseTransform, modelPoseTransform);
    // recursively calculate inverse model transform for all children
    this.children.forEach((bone: Bone) => {
      bone.calculateInverseModelPoseTransform(modelPoseTransform);
    });
  }

  public initRootBone() {
    if (this.id == 0) this.calculateInverseModelPoseTransform(mat4.create());
  }

  public addChild(bone: Bone): void {
    this.children.push(bone);
  }

  public getChildren(): Bone[] {
    return this.children;
  }

  public getinverseModelPoseTransform(): mat4 {
    return this.inverseModelPoseTransform;
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }
}
