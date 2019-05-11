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
      let models = ["res/goat.obj"];
      loader.loadModels(models);
      Main.modelsCount = models.length;
    });
    RenderDefaults.getInstance().loadResource();
  }

  private static modelLoaded(model: Model, name: string, loadedCnt: number) {
    var loadingScreen : HTMLElement = (new LoadingScreen()).render(Main.modelsCount,loadedCnt,name);
    console.log(loadingScreen);
    if (name == "goat") {
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
