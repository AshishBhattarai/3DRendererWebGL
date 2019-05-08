import Renderer from "./renderer";
import LitTextureShader from "../shader/lit_texture_shader";
import { mat4 } from "gl-matrix";
import Model from "../model/model";

export class LitTextureRenderer extends Renderer {
  shader: LitTextureShader;

  constructor(litShader: LitTextureShader) {
    super();
    this.shader = litShader;
  }

  public render(transformation: mat4, model: Model) {
    this.shader.start();
    this.shader.loadTranformation(transformation);
    this.shader.loadMaterial(model.material);
    model.mesh.drawMesh();
  }
}
