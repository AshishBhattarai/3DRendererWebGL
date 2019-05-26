import AnimModel from "./anim_model";
import SAnimation from "./sanimation";
import KeyFrame from "./KeyFrame";
import { mat4 } from "gl-matrix";
import BoneTransform from "./bone_transform";
import Bone from "./bone";
import AnimEntity from "../Enitity/anim_entity";

/**
 * Calculates animeTransform for bones.
 * ie starts and manages animation
 */
export default class SAnimator {
  private static instance = new SAnimator();
  constructor() {
    if (SAnimator.instance) {
      throw new Error("Error: Instatiation failed: use SAnimator.getInstance");
    }
  }

  public static getInstance(): SAnimator {
    return SAnimator.instance;
  }

  public processAnimation(
    delta: number,
    animEntity: AnimEntity,
    animModel: AnimModel
  ) {
    var animation = animModel.getAnimation(animEntity.currentAnimation);
    animEntity.animTime =
      (animEntity.animTime + delta) % animation.getDuration();
    var currentPose = this.calculateAnimationPose(
      animEntity.animTime,
      animation
    );
    this.applyPoseTransform(
      currentPose,
      animModel.getRootBone(),
      mat4.create()
    );
  }

  private applyPoseTransform(
    currentPose: Map<string, mat4>,
    bone: Bone,
    parentTransform: mat4
  ) {
    var currentLocalTransform = currentPose.get(bone.getName());
    var currentTransform = mat4.mul(
      mat4.create(),
      parentTransform,
      currentLocalTransform
    );
    // apply pose transform to all childrens
    bone.getChildren().forEach((childBone: Bone) => {
      this.applyPoseTransform(currentPose, childBone, currentTransform);
    });
    /**
     * (Both(T,F) are model space)
     * currentTransform(T) -> Transform from model origin to current(animtion time) position
     * inverseModelPoseTransform(F) -> Inverse of original(not prev, set only once) transform from model origin to bone first(original) position
     *
     * So, To transform bone to current animtion position in model space: (T-F) or in matrix from (T * inv(F))
     *
     */
    mat4.mul(
      currentTransform,
      bone.getinverseModelPoseTransform(),
      currentTransform
    );
    bone.animTransform = currentTransform;
  }

  private calculateAnimationPose(
    animTime: number,
    currentAnimation: SAnimation
  ): Map<string, mat4> {
    var currentPose = new Map<string, mat4>();
    var boneAnim = currentAnimation.getBoneAnimations();
    // interpolate frames from all bones
    boneAnim.forEach((frames, name) => {
      for (let i = 0; i < frames.length; ++i) {
        if (frames[i].getTimeStamp() > animTime) {
          let nextFrame = frames[i];
          let prevFrame = frames[i - 1];

          let totalTime = nextFrame.getTimeStamp() - prevFrame.getTimeStamp();
          let currentTime = animTime - prevFrame.getTimeStamp();
          let progress = currentTime / totalTime;
          currentPose.set(
            name,
            this.interpolateKeyFrames(prevFrame, nextFrame, progress)
          );
          break;
        }
      }
    });
    return currentPose;
  }

  private interpolateKeyFrames(
    frameA: KeyFrame,
    frameB: KeyFrame,
    progress: number
  ): mat4 {
    return BoneTransform.interpolate(
      frameA.getBoneTransform(),
      frameB.getBoneTransform(),
      progress
    ).getLocalTransform();
  }
}
