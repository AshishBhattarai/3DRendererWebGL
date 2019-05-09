import DisplayManager from "./render_engine/renderer/display_manager";
import RenderEngine from "./render_engine/render_engine";
import Loader from "./loader/loader";
import Model from "./render_engine/model/model";
import Texture, { TextureType } from "./render_engine/model/texture";
import Material from "./render_engine/model/material";
import { MaterialShader } from "./render_engine/shader/shader_config";
import RenderDefaults from "./render_engine/render_defaults";
import Entity from "./render_engine/Enitity/entity";
import { vec3 } from "gl-matrix";

export default class Main {
  private static display = DisplayManager.getInstance();
  private static renderEngine: RenderEngine;
  private static loaderComplete: boolean = false;

  private static renderLoopCall: (frameTime: number) => void;

  public static main(): void {
    this.display.createCanvas([window.innerWidth, window.innerHeight]);
    RenderDefaults.getInstance().loadResource();

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
        this.renderEngine.addModel(model, name);
        this.loaderComplete = true;
      };
      image.src = "res/texture.png";
    });

    loader.loadModel("res/goat.obj");

    var goatEntity = new Entity("goat");
    var entites: Entity[] = [];
    goatEntity.position.set([0, -0.7, -3]);

    for (let i = 0; i < 50; ++i) {
      for (let j = 0; j < 50; ++j) {
        entites.push(new Entity("goat", vec3.fromValues(i+j - 40, i - j, -20)));
      }
    }

    this.renderLoopCall = (frameTime: number) => {
      if (this.loaderComplete) {
        entites.forEach((entity, index) => {
          entity.rotation[1] = (frameTime / 1000) * 1.5 * 0.5;
        });
        this.renderEngine.processEntities(entites);
      }
    };

    this.animationLoop(0);
  }

  private static animationLoop(frameTime: number): void {
    Main.renderLoopCall(frameTime);
    Main.renderEngine.renderFrame(frameTime);
    window.requestAnimationFrame(Main.animationLoop);
  }
}
