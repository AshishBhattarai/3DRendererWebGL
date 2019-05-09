import { vec3, mat4, vec4 } from "gl-matrix";
import Enitity from "./entity";
class Light {
 public position:vec3;
 private rotation:vec3;
 public color:vec3; 

  constructor() {
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.color = vec3.create();
  }
}

export default Light;