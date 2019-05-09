import {Ammo} from 'ammo.js';
import {vec3, mat4} from 'gl-matrix';
class PhysicsWorld {
    gravity:vec3 =  vec3.create();
    constructor(){   
    let broadphase =  new Ammo.btDbvtBroadphase();
    let collConfig = new Ammo.btDefaultCollisionConfiguration();
	let dispatcher = new Ammo.btCollisionDispatcher(collConfig);
    let solver = new Ammo.btSequentialImpulseConstraintSolver();
    
    let dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase,solver,collConfig);
    
    dynamicsWorld.setGravity(this.gravity[0] = 0.0,this.gravity[1] = -10.0, this.gravity[2] = 0.0 );

    }

    

}