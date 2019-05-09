import { vec3, mat4, vec4 } from "gl-matrix";
import Enitity from "./entity";
class Light {
 public position:vec3;
 private rotation:vec3;
 public color:vec3; 
 public rotMat:mat4;

  constructor(positionValue, rotationValue, colorValue) {
    this.rotMat = mat4.create();
    this.position = positionValue;
    this.rotation = rotationValue;
    this.color = colorValue;
  }
}

export default Light;