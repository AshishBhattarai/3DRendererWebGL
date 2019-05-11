import Entity from "../render_engine/Enitity/entity";
import { mat4 } from "gl-matrix";
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

    let rot = new Vec3(0, 0, 0);
    this.physicsBody.quaternion.toEuler(rot);
    this.rotation[0] = rot.x;
    this.rotation[1] = rot.y;
    this.rotation[2] = rot.z;
    let aaa = super.getTransMatrix();
    return aaa;
  }
}
