import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import { MaterialShader } from "./render_engine/shader/shader_config";
import RenderDefaults from "./render_engine/render_defaults";
import SimLoop from "./sim_loop";

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;
  private static simLoop: SimLoop;

  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    var renderDefaults = RenderDefaults.getInstance();
    var loader = new Loader(Main.modelLoaded);

    renderDefaults.setLoadCompleteCallback(() => {
      /* Default Resources Loaded */
      this.renderEngine = new RenderEngine();
      this.simLoop = new SimLoop(this.renderEngine);
      loader.loadModels(["res/goat.obj", "res/sphere.obj", "res/football.obj"]);
    });
    RenderDefaults.getInstance().loadResource();
  }

  private static modelLoaded(model: Model, name: string, loadedCnt: number) {
    switch (name) {
      case "goat":
        let image = new Image();
        image.onload = () => {
          let mat = new Material({
            diffuseMap: new Texture(image, TextureType.DIFFUSE_MAP),
            materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
          });
          model.material = mat;
          Main.renderEngine.addModel(model, name);
        };
        image.src = "res/texture.png";
        break;
      case "sphere":
        Main.renderEngine.addModel(model, name);
        break;
      case "football":
        let image2 = new Image();
        image2.onload = () => {
          let mat2 = new Material({
            diffuseMap: new Texture(image2, TextureType.DIFFUSE_MAP),
            materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
          });
          model.material = mat2;
          Main.renderEngine.addModel(model, name);
        };
        image2.src = "res/football.png";
        break;
    }
    if (loadedCnt == 0) {
      Main.animationLoop(0);
    }
  }

  private static animationLoop(frameTime: number): void {
    Main.display.updateTime(frameTime);
    Main.simLoop.run(frameTime);
    window.requestAnimationFrame(Main.animationLoop);
  }
}
