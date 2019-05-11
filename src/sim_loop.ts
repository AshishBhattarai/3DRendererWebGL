import RenderEngine from "./render_engine/render_engine";
import Entity from "./render_engine/Enitity/entity";
import { vec3, vec2 } from "gl-matrix";
import Camera, { Movement } from "./render_engine/Enitity/camera";
import DisplayManager from "./render_engine/renderer/display_manager";
import Terrain from "./render_engine/terrain/terrain";
import AxisKeyMap, { BoardKeys } from "./input/axis_keymap";
import RenderDefaults from "./render_engine/render_defaults";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private entites: Entity[] = [];
  private terrains: Terrain[] = [];
  private camera: Camera;
  private axisKeyMap = new AxisKeyMap();
  private displayManager = DisplayManager.getInstance();

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

    // Terrain
    this.terrains.push(new Terrain(vec2.fromValues(0, 0)));
    this.terrains[0].position[0] = 100;
  }

  private setActionKeys() {
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.code == "KeyR") {
        this.displayManager.pointerLock();
      }
    };
  }

  private processInput() {
    let delta = this.displayManager.getDelta();
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
    /* Input */
    this.processInput();
    /* Process Data*/
    this.entites.forEach((entity, index) => {
      entity.rotation[1] = (frameTime / 1000) * 1.5 * 0.5;
    });
    this.renderEngine.processEntities(this.entites);
    this.renderEngine.processTerrains(this.terrains);

    /* Render */
    this.renderEngine.renderFrame(frameTime, this.camera);
  }
}
