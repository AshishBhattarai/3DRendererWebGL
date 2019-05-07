import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model, { DefaultMesh } from "./render_engine/model/model";

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;

  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    DefaultMesh.getInstance().loadMesh();
    this.renderEngine = new RenderEngine();
    this.renderEngine.prepare();

    let loader = new Loader((model: Model, name: string) => {
      this.renderEngine.seRenderMesh(model.mesh);
    });

    loader.loadModel("res/test.obj");

    this.animationLoop(0);
  }

  private static animationLoop(time: number): void {
    Main.renderEngine.renderFrame(time);
    window.requestAnimationFrame(Main.animationLoop);
  }
}
