import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model, { DefaultMesh } from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import {
  ShaderConfig,
  MaterialShader
} from "./render_engine/shader/shader_config";

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;

  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    DefaultMesh.getInstance().loadMesh();
    this.renderEngine = new RenderEngine();
    this.renderEngine.prepare();

    let loader = new Loader((model: Model, name: string) => {
      let image = new Image();
      image.onload = () => {
        let mat = new Material({
          diffuseMap: new Texture(image, TextureType.DIFFUSE_MAP),
          materialShader: MaterialShader.LIT_MATERIAL_TEXTURE_SHADER
        });
        model.material = mat;
        this.renderEngine.seRenderMesh(model);
      };
      image.src = "res/texture.png";
    });

    loader.loadModel("res/goat.obj");

    this.animationLoop(0);
  }

  private static animationLoop(time: number): void {
    Main.renderEngine.renderFrame(time);
    window.requestAnimationFrame(Main.animationLoop);
  }
}
