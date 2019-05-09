import Shader from "./shader";
import {
  lit_texture_shader_fs,
  lit_texture_shader_vs
} from "./glsl/shader_source";
import { gl } from "../ogl_globals";
import { mat4 } from "gl-matrix";
import Material from "../model/material";

export default class LitTextureShader extends Shader {
  static readonly DIFFUSE_UNIT = 0;
  static readonly SPECULAR_UNIT = 1;
  static readonly EMISSION_UNIT = 2;

  /* Materices */
  private tranformationLoc: WebGLUniformLocation;

  /* Materials */
  private shininessLoc: WebGLUniformLocation;

  constructor() {
    super(lit_texture_shader_vs, lit_texture_shader_fs);

    this.start();
    this.shininessLoc = this.getUniformLocation("material.shininess");
    gl.uniform1i(
      this.getUniformLocation("material.diffuse"),
      LitTextureShader.DIFFUSE_UNIT
    );
    gl.uniform1i(
      this.getUniformLocation("material.specular"),
      LitTextureShader.SPECULAR_UNIT
    );
    // gl.uniform1i(
    // 	this.getUniformLocation("material.emission"),
    // 	LitTextureShader.EMISSION_UNIT
    // )
    this.tranformationLoc = this.getUniformLocation("tranformationMat");
    this.stop();
  }

  public loadTranformation(tranformationMat: mat4) {
    gl.uniformMatrix4fv(this.tranformationLoc, false, tranformationMat);
  }

  public loadMaterial(material: Material) {
    gl.activeTexture(gl.TEXTURE0);
    material.diffuseMap.bind();
    gl.activeTexture(gl.TEXTURE1);
    material.specularMap.bind();
    // gl.activeTexture(gl.TEXTURE2);
    // material.emissionMap.bind();
    gl.uniform1f(this.shininessLoc, material.shininess);
  }
}
