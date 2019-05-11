import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import { MaterialShader } from "./render_engine/shader/shader_config";
import RenderDefaults from "./render_engine/render_defaults";
import SimLoop from "./sim_loop";
import { Box, LoadingScreen, Input } from './ui/index';

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;
  private static simLoop: SimLoop;
  private static modelsCount;
  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    var renderDefaults = RenderDefaults.getInstance();
    var loader = new Loader(Main.modelLoaded);
    let box1 = (new Box('Options'));
    box1.push((new Input('Gravity', function(value){})).render());
    box1.push(new Input('Force', function(value){}).render());
    
    document.getElementsByTagName('body')[0].appendChild(box1.render({
      position : 'absolute',
      right: '5px',
      left : 'auto',
      top : '5px'
    }));
    renderDefaults.setLoadCompleteCallback(() => {
      /* Default Resources Loaded */
      this.renderEngine = new RenderEngine();
      this.simLoop = new SimLoop(this.renderEngine);
      let models = [
        "res/goat.obj",
        "res/sphere.obj",
        "res/football.obj",
        "res/ball.obj"
      ];
      Main.modelsCount = models.length;
      loader.loadModels(models)
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
