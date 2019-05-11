import RenderEngine from "./render_engine/render_engine";
import Entity from "./render_engine/Enitity/entity";
import { vec3, vec2, glMatrix } from "gl-matrix";
import Camera, { Movement } from "./render_engine/Enitity/camera";
import DisplayManager from "./render_engine/renderer/display_manager";
import Terrain from "./render_engine/terrain/terrain";
import AxisKeyMap, { BoardKeys } from "./input/axis_keymap";
import RenderDefaults from "./render_engine/render_defaults";
import PhysicsWorld from "./physics/physics_world";
import PhysicsEntity from "./physics/physics_entity";
import CANNON, { Vec3 } from "cannon";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private entites: Entity[] = [];
  private terrains: Terrain[] = [];
  private camera: Camera;
  private axisKeyMap = new AxisKeyMap();
  private displayManager = DisplayManager.getInstance();
  private physicsWorld = PhysicsWorld.getInstance();

  constructor(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
    this.renderEngine.setSkybox(RenderDefaults.getInstance().getSkybox());
    this.renderEngine.prepare();
    this.camera = new Camera(vec3.fromValues(-200, 10, -200));
    this.setActionKeys();
    window.onmousemove = (e: MouseEvent) => {
      this.camera.processMouseMovment(
        e.movementY,
        e.movementX,
        this.displayManager.getDelta()
      );
    };

    // Entites dummy data

    this.entites.push(new Entity("goat", vec3.fromValues(-203, 0, -225)));
    this.entites.push(new Entity("goat", vec3.fromValues(-167, 0, -200)));
    this.entites.push(new Entity("goat", vec3.fromValues(-330, 0, -333)));
    this.entites.push(new Entity("goat", vec3.fromValues(-20, 0, -106)));
    this.entites.push(new Entity("goat", vec3.fromValues(-120, 0, -66)));
    this.entites.push(new Entity("goat", vec3.fromValues(-304, 0, -25)));
    this.entites.push(new Entity("goat", vec3.fromValues(-23, 0, -22)));
    this.entites.push(new Entity("goat", vec3.fromValues(-3, 0, -2)));
    this.entites.push(new Entity("goat", vec3.fromValues(-173, 0, -25)));
    this.entites.push(new Entity("goat", vec3.fromValues(-200, 0, -195)));


    // Terrain
    this.terrains.push(new Terrain(vec2.fromValues(0, 0), 400, 4, 50));
    this.terrains[0].position[0] = 100;

    //Physics test
    let phyBody = new CANNON.Body({
      position: new Vec3(0, 0, 0),
      mass: 0,
      shape: new CANNON.Plane()
    });
    phyBody.quaternion.setFromAxisAngle(
      new Vec3(1, 0, 0),
      glMatrix.toRadian(-90)
    );
    this.physicsWorld.world.addBody(phyBody);
  }

  private setActionKeys() {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.code == "KeyR") {
        this.displayManager.pointerLock();
      }
      if (e.code == "KeyQ") {
        let camPos = this.camera.getPosition();
        let cCamPos = new Vec3(camPos[0], camPos[1], camPos[2]);
        let physicsBody = new CANNON.Body({
          allowSleep: true,
          mass: 1,
          position: cCamPos,
          shape: new CANNON.Sphere(1.0)
        });
        let frontDir = this.camera.getFront();
        let impulse = new Vec3(-frontDir[0], -frontDir[1], -frontDir[2]);
        impulse = impulse.mult(15, impulse);
        physicsBody.applyImpulse(impulse, cCamPos);
        let physicsEntity = new PhysicsEntity(physicsBody, "football");
        this.entites.push(physicsEntity);
        this.physicsWorld.world.addBody(physicsBody);
      }
    };
  }

  private processInput(delta: number) {
    let map = this.axisKeyMap.getKeyEventMap();
    if (map.get(BoardKeys.KEY_W)) {
      this.camera.processMovement(Movement.FORWARD, delta);
    } else if (map.get(BoardKeys.KEY_S)) {
      this.camera.processMovement(Movement.BACKWARD, delta);
    }
    if (map.get(BoardKeys.KEY_D)) {
      this.camera.processMovement(Movement.RIGHT, delta);
    } else if (map.get(BoardKeys.KEY_A)) {
      this.camera.processMovement(Movement.LEFT, delta);
    }
  }

  public run(frameTime: number) {
    let delta = this.displayManager.getDelta();
    /* Input */
    this.processInput(delta);
    /* Process Data*/
    this.physicsWorld.process(delta);
   
    this.renderEngine.processEntities(this.entites);
    this.renderEngine.processTerrains(this.terrains);

    /* Render */
    this.renderEngine.renderFrame(frameTime, this.camera);
  }
}
