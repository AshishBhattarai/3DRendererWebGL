import  {vec3, mat4} from 'gl-matrix';
import Ammo from 'ammo.js';
import { toRadian } from 'gl-matrix/src/gl-matrix/common';

class RigidBody{
    originVector:vec3 = vec3.create();
    public position:vec3;
    public rotation:vec3;
    public mass;
    public transformation:mat4;
    public inertia:vec3;
    constructor(){
        this.transformation = mat4.create();
        mat4.identity(this.transformation);
        let trans = new Ammo.btTransform();
        trans.setOrigin(this.originVector[0] = this.position[0],this.originVector[1] = this.position[1], this.originVector[2] = this.position[2]);


        let quat = new Ammo.btQuaternion();
        quat.setEuler(toRadian(this.position[1]),toRadian(this.position[0]),toRadian(this.position[2]));
        trans.setRotation(quat);

        let cShape = new Ammo.btCollisionShape();
        cShape = cShape.shape;
        this.inertia.fill(0,0,0);
        if(this.mass){
            cShape.calculateLocalInertia(this.mass,this.inertia)
        }
        let motionState = new Ammo.btDefaultMotionState(trans);
        let rigidBody = new Ammo.btRigidBody(this.mass,motionState,cShape,this.inertia) ;
    }

    public addToWorld() {
        
    }

}