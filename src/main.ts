import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import { MaterialShader } from "./render_engine/shader/shader_config";
import RenderDefaults from "./render_engine/render_defaults";
import SimLoop from "./sim_loop";
import { render as renderUI, renderUILoop, UI } from "./ui/entry";
import { LoadingScreen } from "./ui/index";
import SceneManager from "./scene_manager";
export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;
  private static simLoop: SimLoop;
  private static modelsCount: number;
  private static ui : UI;
  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    var renderDefaults = RenderDefaults.getInstance();
    var loader = new Loader(Main.modelLoaded);
    renderDefaults.setLoadCompleteCallback(() => {
      /* Default Resources Loaded */
      this.renderEngine = new RenderEngine();
      SceneManager.getInstance().loadDefaultScene(); // muse be done before SimLoop
      this.simLoop = new SimLoop(this.renderEngine);
      let models = [
        "res/goat.obj",
        "res/sphere.obj",
        "res/football.obj",
        "res/ball.obj",
        "res/brick.obj"
      ];
      Main.modelsCount = models.length;
      loader.loadModels(models);
      Main.ui = renderUI();
      Main.ui.render();
    });
    RenderDefaults.getInstance().loadResource();
  }

  private static modelLoaded(model: Model, name: string, loadedCnt: number) {
    var loadingScreen: HTMLElement = new LoadingScreen().render(
      Main.modelsCount,
      loadedCnt,
      name
    );
    // document.getElementsByTagName('body')[0].appendChild(loadingScreen);
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
      case "ball":
        let image3 = new Image();
        image3.onload = () => {
          let mat3 = new Material({
            diffuseMap: new Texture(image3, TextureType.DIFFUSE_MAP),
            materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
          });
          model.material = mat3;
          Main.renderEngine.addModel(model, name);
        };
        image3.src = "res/ball.png";
        break;
      case "brick":
        let image4 = new Image();
        image4.onload = () => {
          let mat4 = new Material({
            diffuseMap: new Texture(image4, TextureType.DIFFUSE_MAP),
            materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
          });
          model.material = mat4;
          Main.renderEngine.addModel(model, name);
        };
        image4.src = "res/brick.jpg";
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
