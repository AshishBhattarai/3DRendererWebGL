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
    this.camera = new Camera(vec3.fromValues(0, 10, 0));
    this.setActionKeys();
    window.onmousemove = (e: MouseEvent) => {
      this.camera.processMouseMovment(
        e.movementY,
        e.movementX,
        this.displayManager.getDelta()
      );
    };

    // Entites dummy data
    for (let i = 0; i < 20; ++i) {
      for (let j = 0; j < 20; ++j) {
        this.entites.push(
          new Entity("goat", vec3.fromValues(i + j - 40, i - j, -20))
        );
      }
    }
    this.entites.push(new Entity("football", vec3.fromValues(0, 10, 0)));

    // Terrain
    this.terrains.push(new Terrain(vec2.fromValues(0, 0)));
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
        let physicsBody = new CANNON.Body({
          allowSleep: true,
          mass: 1,
          position: new Vec3(camPos[0], camPos[1], camPos[2]),
          shape: new CANNON.Sphere(1.0)
        });
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
    this.entites.forEach((entity, index) => {
      if (entity.modelName == "goat") {
        entity.rotation[1] = (frameTime / 1000) * 1.5 * 0.5;
      }
    });
    this.renderEngine.processEntities(this.entites);
    this.renderEngine.processTerrains(this.terrains);

    /* Render */
    this.renderEngine.renderFrame(frameTime, this.camera);
  }
}
