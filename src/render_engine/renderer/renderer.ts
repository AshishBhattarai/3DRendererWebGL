import "../shader/lit_color_shader";
import { mat4 } from "gl-matrix";
import Model from "../model/model";
import Shader from "../shader/shader";

export default abstract class Renderer {
  abstract shader: Shader;

  abstract render(transformation: mat4, model: Model): void;
}
