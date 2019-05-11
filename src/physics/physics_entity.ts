import Entity from "../render_engine/Enitity/entity";
import { mat4, quat } from "gl-matrix";
import { Vec3 } from "cannon";

export default class PhysicsEntity extends Entity {
  private physicsBody: CANNON.Body;
  constructor(physicsBody: CANNON.Body, modelName: string) {
    super(modelName);
    this.physicsBody = physicsBody;
  }

  getTransMatrix(): mat4 {
    this.position[0] = this.physicsBody.position.x;
    this.position[1] = this.physicsBody.position.y;
    this.position[2] = this.physicsBody.position.z;

    let cQuat = this.physicsBody.quaternion;
    let rot = quat.fromValues(cQuat.x, cQuat.y, cQuat.z, cQuat.w);
    let eular = new Vec3();
    cQuat.toEuler(eular);
    this.rotation[0] = eular.x;
    this.rotation[1] = eular.y;
    this.rotation[2] = eular.z;

    var transformation = mat4.create();
    mat4.identity(transformation);
    mat4.translate(transformation, transformation, this.position);
    mat4.multiply(
      transformation,
      transformation,
      mat4.fromQuat(mat4.create(), rot)
    );
    mat4.scale(transformation, transformation, this.scale);
    return transformation;
  }
}
