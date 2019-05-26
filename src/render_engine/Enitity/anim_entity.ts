import Entity from "./entity";
import { vec3 } from "gl-matrix";

export default class AnimEntity extends Entity {
  public animTime = 0; // current animation time
  public isAnimate = true;
  public currentAnimation: string = "";
}
