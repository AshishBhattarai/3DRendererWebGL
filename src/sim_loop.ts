import RenderEngine from "./render_engine/render_engine";
import Entity from "./render_engine/Enitity/entity";
import { vec3, vec2 } from "gl-matrix";
import Camera, { Movement } from "./render_engine/Enitity/camera";
import DisplayManager from "./render_engine/renderer/display_manager";
import Terrain from "./render_engine/terrain/terrain";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private entites: Entity[] = [];
  private terrains: Terrain[] = [];
  private camera: Camera;

  constructor(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
    this.renderEngine.prepare();
    this.camera = new Camera(vec3.fromValues(0, 10, 0));
    let displayManager = DisplayManager.getInstance();

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      let delta = displayManager.getDelta();
      switch (e.code) {
        case "KeyW":
          this.camera.processMovement(Movement.FORWARD, delta);
          break;
        case "KeyD":
          this.camera.processMovement(Movement.RIGHT, delta);
          break;
        case "KeyS":
          this.camera.processMovement(Movement.BACKWARD, delta);
          break;
        case "KeyA":
          this.camera.processMovement(Movement.LEFT, delta);
          break;
      }
    });

    // Entites dummy data
    for (let i = 0; i < 50; ++i) {
      for (let j = 0; j < 50; ++j) {
        this.entites.push(
          new Entity("goat", vec3.fromValues(i + j - 40, i - j, -20))
        );
      }
    }

    // Terrain
    this.terrains.push(new Terrain(vec2.fromValues(1, 1)));
  }

  public run(frameTime: number) {
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
