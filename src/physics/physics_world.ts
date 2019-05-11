import CANNON from "cannon";

export default class PhysicsWorld {
  private static readonly GRAVITY = -10.0;
  private static readonly FIXED_DELTA = 1 / 60;
  private static readonly MAX_STEPS = 3;

  private static instance = new PhysicsWorld();

  public world: CANNON.World;

  constructor() {
    if (PhysicsWorld.instance) {
      throw new Error(
        "Error: Instatiation failed: use PhysicsWorld.getInstance"
      );
    }
    this.world = new CANNON.World();
    this.world.gravity.set(0, PhysicsWorld.GRAVITY, 0);
  }

  public process(delta: number) {
    this.world.step(PhysicsWorld.FIXED_DELTA, delta, PhysicsWorld.MAX_STEPS);
  }

  static getInstance(): PhysicsWorld {
    return this.instance;
  }
}
