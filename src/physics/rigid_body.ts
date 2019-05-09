import  {vec3, mat4} from 'gl-matrix';
import Ammo from 'ammo.js';

class RigidBody{
    originVector:vec3 = vec3.create();
    public position:vec3;
    public rotation:vec3;
    public mass;
    public transformation:mat4
    constructor(){
        this.transformation = mat4.create();
        mat4.identity(this.transformation);
        this.transformation = new Ammo.btTransform();
        this.transformation.setOrigin(this.originVector[0] = this.position[0],this.originVector[1] = this.position[1], this.originVector[2] = this.position[2]);
    }

}