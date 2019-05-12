import RenderEngine from "./render_engine/render_engine";
import Entity from "./render_engine/Enitity/entity";
import { vec3 } from "gl-matrix";
import Camera, { Movement } from "./render_engine/Enitity/camera";
import DisplayManager from "./render_engine/renderer/display_manager";
import Terrain from "./render_engine/terrain/terrain";
import AxisKeyMap, { BoardKeys } from "./input/axis_keymap";
import PhysicsWorld from "./physics/physics_world";
import PhysicsEntity from "./physics/physics_entity";
import CANNON from "cannon";
import Scene from "./scene";
import SceneManager from "./scene_manager";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private entites: Entity[] = [];
  private terrains: Terrain[] = [];
  private camera: Camera;
  private axisKeyMap = new AxisKeyMap();
  private displayManager = DisplayManager.getInstance();
  private physicsWorld = PhysicsWorld.getInstance();
  private sceneManager = SceneManager.getInstance();
  private currentScene: Scene;

  constructor(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
    this.renderEngine.prepare();
    this.sceneManager.onSceneChangeListener(scene => {
      this.loadCurrentScene(scene);
    });
    this.loadCurrentScene(this.sceneManager.getCurrentScene());
    this.setActionKeys();
    window.onmousemove = (e: MouseEvent) => {
      this.camera.processMouseMovment(
        e.movementY,
        e.movementX,
        this.displayManager.getDelta()
      );
    };

    // scenes
    this.createPlanetMoonScene();
    this.sceneManager.setCurrentScene("planetmoon");
    this.currentScene.onPrepare();
  }

  private setActionKeys() {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.code == "KeyR") {
        this.displayManager.pointerLock();
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
    this.entites = scene.entities;
    this.terrains = scene.terrains;
  }

  public run(frameTime: number) {
    let delta = this.displayManager.getDelta();
    /* Input */
    this.processInput(delta);
    /* Process Data*/
    this.physicsWorld.process(delta);
    this.currentScene.onFrameLoop(frameTime);

    this.renderEngine.processEntities(this.entites);
    this.renderEngine.processTerrains(this.terrains);

    /* Render */
    this.renderEngine.renderFrame(frameTime, this.camera);
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
}
