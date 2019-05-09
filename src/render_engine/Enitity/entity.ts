import { vec3, mat4 } from "gl-matrix";
import Light from "./light";

export default class Enitity {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  private transformation: mat4;
  

  constructor() {
    this.position = vec3.create();
    this.rotation = vec3.create();
    this.scale = vec3.create();

    this.transformation = mat4.create();
    mat4.identity(this.transformation);
  }

  public getTransMatrix() {
    mat4.translate(this.transformation, this.transformation, this.position);
    mat4.rotateY(this.transformation, this.transformation, this.rotation[0]);
    mat4.rotateX(this.transformation, this.transformation, this.rotation[1]);
    mat4.rotateZ(this.transformation, this.transformation, this.rotation[2]);
    mat4.scale(this.transformation, this.transformation, this.scale);
    return this.transformation;
  }



}
