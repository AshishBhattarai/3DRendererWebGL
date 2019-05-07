import Shader from "./shader";
import { gl } from "../ogl_globals";
import { lit_color_shader_vs, lit_color_shader_fs } from "./glsl/shader_source";
import { vec3, mat4 } from "gl-matrix";
import Material from "../model/material";

export default class LitColorShader extends Shader {
  /* Materices */
  private projectionLoc: WebGLUniformLocation;
  private tranformationLoc: WebGLUniformLocation;

  /* Material */
  private ambientLoc: WebGLUniformLocation;
  private diffuseLoc: WebGLUniformLocation;
  private specularLoc: WebGLUniformLocation;
  private shininessLoc: WebGLUniformLocation;
  private kaLoc: WebGLUniformLocation;
  private kdLoc: WebGLUniformLocation;
  private ksLoc: WebGLUniformLocation;

  /* Sun */
  private sunPosLoc: WebGLUniformLocation;
  private cameraPosLoc: WebGLUniformLocation;
  private sunColLoc: WebGLUniformLocation;

  constructor() {
    super(lit_color_shader_vs, lit_color_shader_fs);

    this.start();
    /* Materices */
    this.projectionLoc = this.getUniformLocation("projectionMat");
    this.tranformationLoc = this.getUniformLocation("tranformationMat");

    /* Material */
    this.ambientLoc = this.getUniformLocation("material.ambient");
    this.diffuseLoc = this.getUniformLocation("material.diffuse");
    this.specularLoc = this.getUniformLocation("material.specular");
    this.shininessLoc = this.getUniformLocation("material.shininess");
    this.kaLoc = this.getUniformLocation("material.ka");
    this.kdLoc = this.getUniformLocation("material.kd");
    this.ksLoc = this.getUniformLocation("material.ks");

    /* Sun */
    this.sunPosLoc = this.getUniformLocation("sunPosition");
    this.cameraPosLoc = this.getUniformLocation("cameraPosition");
    this.sunColLoc = this.getUniformLocation("sunColor");
    this.stop();
  }

  public loadMaterial(material: Material): void {
    gl.uniform3fv(this.ambientLoc, material.ambient);
    gl.uniform3fv(this.diffuseLoc, material.diffuse);
    gl.uniform3fv(this.specularLoc, material.specular);
    gl.uniform1f(this.shininessLoc, material.shininess);
    gl.uniform1f(this.kaLoc, material.ka);
    gl.uniform1f(this.kdLoc, material.kd);
    gl.uniform1f(this.ksLoc, material.ks);
  }

  public loadSun(sunPosition: vec3, sunColor: vec3): void {
    gl.uniform3fv(this.sunPosLoc, sunPosition);
    gl.uniform3fv(this.sunColLoc, sunColor);
  }

  public loadProjection(projectionMat: mat4) {
    gl.uniformMatrix4fv(this.projectionLoc, false, projectionMat);
  }

  public loadTranformation(tranformationMat: mat4) {
    gl.uniformMatrix4fv(this.tranformationLoc, false, tranformationMat);
  }

  public loadCameraPosition(cameraPosition: vec3) {
    gl.uniform3fv(this.cameraPosLoc, cameraPosition);
  }
}
