import { vec3, mat4 } from "gl-matrix";

export default class Entity {
  public position: vec3;
  public rotation: vec3;
  public scale: vec3;
  public modelName: string;

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
  }

  public getTransMatrix() {
    var transformation = mat4.create();
    mat4.identity(transformation);
    mat4.translate(transformation, transformation, this.position);
    mat4.rotateY(transformation, transformation, this.rotation[1]);
    mat4.rotateX(transformation, transformation, this.rotation[0]);
    mat4.rotateZ(transformation, transformation, this.rotation[2]);
    mat4.scale(transformation, transformation, this.scale);
    return transformation;
  }
}
