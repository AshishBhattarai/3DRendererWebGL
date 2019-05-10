import RenderEngine from "./render_engine/render_engine";
import Entity from "./render_engine/Enitity/entity";
import { vec3 } from "gl-matrix";
import Main from "./main";

export default class SimLoop {
  private renderEngine: RenderEngine;
  private entites: Entity[] = [];

  constructor(renderEngine: RenderEngine) {
    this.renderEngine = renderEngine;
    this.renderEngine.prepare();

    // Entites dummy data
    for (let i = 0; i < 50; ++i) {
      for (let j = 0; j < 50; ++j) {
        this.entites.push(
          new Entity("goat", vec3.fromValues(i + j - 40, i - j, -20))
        );
      }
    }
  }

  public run(frameTime: number) {
    this.entites.forEach((entity, index) => {
      entity.rotation[1] = (frameTime / 1000) * 1.5 * 0.5;
    });
    this.renderEngine.processEntities(this.entites);
  }
}
