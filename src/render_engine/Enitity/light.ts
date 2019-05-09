import { vec3, mat4, vec4 } from "gl-matrix";
import Enitity from "./entity";
class Light {
 public position:vec3;
 private rotation:vec3;
 public color:vec3; 
 public ROTMAT:mat4;

  constructor(positionValue, rotationValue, colorValue) {
    this.ROTMAT = mat4.create();
    this.position = positionValue;
    this.rotation = rotationValue;
    this.color = colorValue;
  }

  public applyRotation() {
    mat4.rotateY(this.ROTMAT,this.ROTMAT,this.position[0])
    mat4.rotateX(this.ROTMAT,this.ROTMAT,this.position[1]);
    mat4.rotateZ(this.ROTMAT,this.ROTMAT,this.position[2]);

    mat4.multiply(this.position,this.ROTMAT,this.position)
    
  }
}

export default Light;