import Renderer from "./renderer";
import LitColorShader from "../shader/lit_color_shader";
import { mat4 } from "gl-matrix";
import Model from "../model/model";

export class LitColorRenderer extends Renderer {
  shader: LitColorShader;

  constructor(litShader: LitColorShader) {
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
