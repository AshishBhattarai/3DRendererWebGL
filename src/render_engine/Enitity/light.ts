import { vec3, mat4, vec4 } from "gl-matrix";

export default class Light {
  public position: vec4;
  public color: vec3;

  private rotation: vec3;
  private rotMat: mat4;

  constructor(
    color = vec3.fromValues(0, 0, 0),
    position = vec4.fromValues(0, 0, 0, 0),
    rotation = vec3.fromValues(0, 0, 0)
  ) {
    this.color = color;
    this.position = position;
    this.rotMat = mat4.create();
    mat4.identity(this.rotMat);

    this.rotate(rotation);
  }

  public rotate(rotation: vec3) {
    this.rotation = rotation;

    mat4.rotateY(this.rotMat, this.rotMat, rotation[1]);
    mat4.rotateX(this.rotMat, this.rotMat, rotation[0]);
    mat4.rotateZ(this.rotMat, this.rotMat, rotation[2]);

    vec4.transformMat4(this.position, this.position, this.rotMat);
  }
}
