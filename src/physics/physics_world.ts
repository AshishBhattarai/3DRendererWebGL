import "@stardazed/ammo";
class PhysicsWorld {
  constructor() {
    let broadphase = new Ammo.btDbvtBroadphase();
    let collConfig = new Ammo.btDefaultCollisionConfiguration();
    let dispatcher = new Ammo.btCollisionDispatcher(collConfig);
    let solver = new Ammo.btSequentialImpulseConstraintSolver();

    let dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      collConfig
    );

    dynamicsWorld.setGravity(new Ammo.btVector3(0.0, -10.0, 0.0));
  }
}
