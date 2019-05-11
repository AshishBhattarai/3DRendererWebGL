import { quat, mat4, vec3, glMatrix } from "gl-matrix";

export enum Movement {
  FORWARD = 0,
  BACKWARD,
  LEFT,
  RIGHT
}

export default class Camera {
  // default settings
  private static readonly YAW = 0.0;
  private static readonly PITCH = 0.0;
  private static readonly ROLL = 0.0;
  private static readonly SPEED = 15.5;
  private static readonly SENSITIVITY = 4.0;
  private static readonly ZOOM = 45.0;

  // matrices
  private orientation: quat;
  private viewMat: mat4;

  // direction
  private front: vec3;
  private right: vec3;
  private up: vec3;

  // attributes
  private position: vec3;
  private rotation: vec3;
  private movementSpeed: number;
  private mouseSensitivity: number;

  constructor(
    position = vec3.fromValues(0, 0, 0),
    rotation = vec3.fromValues(Camera.PITCH, Camera.YAW, Camera.ROLL),
    movementSpeed = Camera.SPEED,
    mouseSensitivity = Camera.SENSITIVITY
  ) {
    this.position = position;
    this.rotation = rotation;
    this.movementSpeed = movementSpeed;
    this.mouseSensitivity = mouseSensitivity;

    this.viewMat = mat4.create();
    this.orientation = quat.create();
    mat4.identity(this.viewMat);
    this.updateCameraDirection();
  }

  private calculateViewMatrix() {
    mat4.fromQuat(this.viewMat, this.orientation);
    this.viewMat = mat4.translate(
      this.viewMat,
      this.viewMat,
      vec3.fromValues(-this.position[0], -this.position[1], -this.position[2])
    );
  }

  private updateCameraDirection() {
    quat.setAxisAngle(
      this.orientation,
      [1, 0, 0],
      glMatrix.toRadian(this.rotation[0])
    );
    quat.mul(
      this.orientation,
      this.orientation,
      quat.setAxisAngle(
        quat.create(),
        [0, 1, 0],
        glMatrix.toRadian(this.rotation[1])
      )
    );

    this.calculateViewMatrix();

    this.front = vec3.fromValues(
      this.viewMat[2],
      this.viewMat[6],
      this.viewMat[10]
    );
    this.right = vec3.fromValues(
      this.viewMat[0],
      this.viewMat[4],
      this.viewMat[8]
    );
    this.up = vec3.fromValues(
      this.viewMat[1],
      this.viewMat[5],
      this.viewMat[9]
    );
  }

  public processMovement(movement: Movement, dt: number) {
    var speed = this.movementSpeed * dt;
    var direction = vec3.create();

    switch (movement) {
      case Movement.FORWARD:
        vec3.sub(direction, direction, this.front);
        break;
      case Movement.BACKWARD:
        vec3.add(direction, direction, this.front);
        break;
      case Movement.RIGHT:
        vec3.add(direction, direction, this.right);
        break;
      case Movement.LEFT:
        vec3.sub(direction, direction, this.right);
        break;
    }

    vec3.normalize(direction, direction);
    vec3.scale(direction, direction, speed);
    vec3.add(this.position, this.position, direction);
    this.calculateViewMatrix();
  }

  public processMouseMovment(xoffset: number, yoffset: number, dt: number) {
    var speed = this.mouseSensitivity * dt;

    this.rotation[0] += xoffset * speed;
    this.rotation[1] += yoffset * speed;

    if (this.rotation[0] > 89.0) {
      this.rotation[0] = 89.0;
    } else if (this.rotation[0] < -89.0) {
      this.rotation[0] = -89.0;
    }

    this.updateCameraDirection();
  }

  public getPosition(): vec3 {
    return this.position;
  }

  public getFront(): vec3 {
    return this.front;
  }

  public getRight(): vec3 {
    return this.right;
  }

  public getViewMatrix(): mat4 {
    return this.viewMat;
  }
}
