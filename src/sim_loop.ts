import RenderEngine from "./render_engine/render_engine";
import { vec3, vec2, glMatrix } from "gl-matrix";
import Camera, { Movement } from "./render_engine/Enitity/camera";
import DisplayManager from "./render_engine/renderer/display_manager";
import AxisKeyMap, { BoardKeys } from "./input/axis_keymap";
import PhysicsWorld from "./physics/physics_world";
import PhysicsEntity from "./physics/physics_entity";
import CANNON, { Vec3 } from "cannon";
import Scene from "./scene";
import SceneManager from "./scene_manager";
import Entity from "./render_engine/Enitity/entity";
import Terrain from "./render_engine/terrain/terrain";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private camera: Camera;
  private axisKeyMap = new AxisKeyMap();
  private displayManager = DisplayManager.getInstance();
  private physicsWorld = PhysicsWorld.getInstance();
  private sceneManager = SceneManager.getInstance();
  private currentScene: Scene;
  private isPaused = false;

  public ballMass = 2;
  public ballImpulse = 55;

  constructor(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
    this.renderEngine.prepare();
    this.sceneManager.onSceneChangeListener(scene => {
      this.loadCurrentScene(scene);
    });
    this.loadCurrentScene(this.sceneManager.getCurrentScene());
    this.setActionKeys();
    window.onmousemove = (e: MouseEvent) => {
      if (!this.displayManager.getisPointerCaptured()) return;
      this.camera.processMouseMovment(
        e.movementY,
        e.movementX,
        this.displayManager.getDelta()
      );
    };

    // scenes
    // this.createPlanetMoonScene();
    this.createBrickScene();

    this.sceneManager.setCurrentScene("brickscene");
    this.currentScene.onPrepare();
  }

  private setActionKeys() {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.code == "KeyR") {
        this.displayManager.pointerLock();
      }
      if (e.code == "Space") {
        this.isPaused = !this.isPaused;
      }
      this.currentScene.onKeyDown(e.code);
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

  private loadCurrentScene(scene: Scene) {
    this.currentScene = scene;
    this.camera = scene.camera;
    this.renderEngine.setSkybox(scene.skybox);
  }

  public run(frameTime: number) {
    let delta = this.displayManager.getDelta();
    /* Input */
    this.processInput(delta);
    /* Process Data*/
    if (!this.isPaused) this.physicsWorld.process(delta);
    this.currentScene.onFrameLoop(frameTime);

    this.renderEngine.processEntities(this.currentScene.entities);
    this.renderEngine.processTerrains(this.currentScene.terrains);

    /* Render */
    this.renderEngine.renderFrame(delta, this.camera);
  }

  private createPlanetMoonScene() {
    // New Secne - moonPlanet
    var world = this.physicsWorld.world;
    var mass = 5;
    var moonShape = new CANNON.Sphere(0.5);
    var planetShape = new CANNON.Sphere(3.5);
    var moon = new CANNON.Body({
      mass: mass,
      position: new CANNON.Vec3(5, 20, 0)
    });
    moon.addShape(moonShape);
    var planet = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 20, 0)
    });
    planet.addShape(planetShape);
    moon.velocity.set(0, 0, 8);
    moon.linearDamping = 0.0;
    moon.preStep = function() {
      var moon_to_planet = new CANNON.Vec3();
      moon_to_planet = planet.position.vsub(moon.position);
      var distance = moon_to_planet.norm();
      moon_to_planet.normalize();
      moon_to_planet.mult(1500 / Math.pow(-distance, 2), this.force);
    };
    world.addBody(moon);
    world.addBody(planet);

    this.sceneManager.addScene(
      new Scene({
        name: "planetmoon",
        camera: new Camera(vec3.fromValues(0, 20, 10)),
        entities: [
          new PhysicsEntity(planet, "sphere", vec3.fromValues(3.5, 3.5, 3.5)),
          new PhysicsEntity(moon, "sphere", vec3.fromValues(0.5, 0.5, 0.5))
        ]
      })
    );
  }

  private createBrickScene() {
    var entities: Entity[] = [];

    var world = this.physicsWorld.world;
    var ballShape = new CANNON.Sphere(1);
    // var brickShape = new CANNON.Box(new Vec3(0.5, 0.125, 0.25));

    // terrain plane
    let planeBody = new CANNON.Body({
      position: new Vec3(0, 0, 0),
      mass: 0,
      shape: new CANNON.Plane()
    });
    planeBody.quaternion.setFromAxisAngle(
      new Vec3(1, 0, 0),
      glMatrix.toRadian(-90)
    );
    world.addBody(planeBody);

    var camPos = this.camera.getPosition();
    // goat grid
    for (let y = 1, i = 1; i < 5; y += 2, i++) {
      for (let z = 1, j = 1; j < 5; z += 2, j++) {
        for (let x = 1, k = 1; k < 5; x += 2, k++) {
          let goatEntity = new Entity(
            "goat",
            vec3.fromValues(camPos[0] - 10 + x, y, camPos[2] - 10 + z)
          );
          entities.push(goatEntity);
        }
      }
    }

    var scene = new Scene({
      name: "brickscene",
      entities: entities,
      terrains: [new Terrain(vec2.fromValues(0, 0), 400, 4, 50)],
      camera: new Camera(vec3.fromValues(-200, 10, -200)),
      onKeyDown: (code: string) => {
        if (code == "KeyQ") {
          let gCamPos = this.camera.getPosition();
          let cCamPos = new Vec3(gCamPos[0], gCamPos[1], gCamPos[2]);
          let physicsBody = new CANNON.Body({
            allowSleep: true,
            mass: this.ballMass,
            position: cCamPos,
            shape: ballShape
          });
          let frontDir = this.camera.getFront();
          let impulse = new Vec3(-frontDir[0], -frontDir[1], -frontDir[2]);
          impulse = impulse.mult(this.ballImpulse, impulse);
          physicsBody.applyImpulse(impulse, cCamPos);
          entities.push(new PhysicsEntity(physicsBody, "football"));
          world.addBody(physicsBody);
        }
      }
    });

    this.sceneManager.addScene(scene);
  }
}
