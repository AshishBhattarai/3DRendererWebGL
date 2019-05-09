import { vec3, mat4 } from "gl-matrix";

export default class Enitity {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public modelName: string;
  private transformation: mat4;

  constructor(
    modelName: string,
    position = vec3.fromValues(0, 0, 0),
    rotation = vec3.fromValues(0, 0, 0),
    scale = vec3.fromValues(1, 1, 1)
  ) {
    this.modelName = modelName;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;

    this.transformation = mat4.create();
    mat4.identity(this.transformation);
  }

  public getTransMatrix() {
    mat4.translate(this.transformation, this.transformation, this.position);
    mat4.rotateY(this.transformation, this.transformation, this.rotation[1]);
    mat4.rotateX(this.transformation, this.transformation, this.rotation[0]);
    mat4.rotateZ(this.transformation, this.transformation, this.rotation[2]);
    mat4.scale(this.transformation, this.transformation, this.scale);
    return this.transformation;
  }
}
