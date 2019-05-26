import Model, { IModel } from "./model";
import Bone from "./bone";
import { mat4 } from "gl-matrix";
import SAnimation from "./sanimation";

export interface IAnimModel extends IModel {
  rootBone: Bone;
  boneCount: number;
}

// Animated Model
export default class AnimModel extends Model {
  private rootBone: Bone;
  private boneCount: number;
  private animations: Map<string, SAnimation> = new Map<string, SAnimation>();

  constructor(iAnimModel: IAnimModel) {
    super(iAnimModel);

    this.rootBone = iAnimModel.rootBone;
    this.boneCount = iAnimModel.boneCount;
    this.rootBone.initRootBone();
  }

  private addBonesToArray(parentBone: Bone, boneMats: mat4[]) {
    boneMats[parentBone.getId()] = parentBone.animTransform;
    parentBone.getChildren().forEach((childBone: Bone) => {
      this.addBonesToArray(childBone, boneMats);
    });
  }

  // get tranformation for all the bones - used in shader
  public getBoneTranforms(): mat4[] {
    var boneMats: mat4[] = [];
    this.addBonesToArray(this.rootBone, boneMats);
    return boneMats;
  }

  public addAnimation(name: string, animation: SAnimation) {
    this.animations.set(name, animation);
  }

  public getAnimation(name: string): SAnimation {
    if (this.animations.has(name)) return this.animations.get(name);
    else this.animations.values[0];
  }

  public getBoneCount(): number {
    return this.boneCount;
  }

  public getRootBone(): Bone {
    return this.rootBone;
  }
}
