import Shader from "./shader";
import { gl } from "../ogl/oglGlobals";
import { lit_color_shader_vs, lit_color_shader_fs } from "./glsl/shader_source";
import { vec3, mat4 } from "gl-matrix";
import Material from "../model/material";

export default class LitColorShader extends Shader {
  /* Materices */
  private tranformationLoc: WebGLUniformLocation;

  /* Material */
  private diffuseLoc: WebGLUniformLocation;
  private specularLoc: WebGLUniformLocation;
  private shininessLoc: WebGLUniformLocation;

  constructor(vsSource = lit_color_shader_vs, fsSource = lit_color_shader_fs) {
    super(vsSource, fsSource);

    this.start();
    /* Materices */
    this.tranformationLoc = this.getUniformLocation("tranformationMat");

    /* Material */
    this.diffuseLoc = this.getUniformLocation("material.diffuse");
    this.specularLoc = this.getUniformLocation("material.specular");
    this.shininessLoc = this.getUniformLocation("material.shininess");

    this.stop();
  }

  public loadMaterial(material: Material): void {
    gl.uniform3fv(this.diffuseLoc, material.diffuse);
    gl.uniform3fv(this.specularLoc, material.specular);
    gl.uniform1f(this.shininessLoc, material.shininess);
  }

  public loadTranformation(tranformationMat: mat4) {
    gl.uniformMatrix4fv(this.tranformationLoc, false, tranformationMat);
  }
}
