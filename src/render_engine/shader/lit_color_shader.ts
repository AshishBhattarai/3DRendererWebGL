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
  private diffuseLoc: WebGLUniformLocation;
  private specularLoc: WebGLUniformLocation;
  private shininessLoc: WebGLUniformLocation;

  /* Sun */
  private sunPosLoc: WebGLUniformLocation;
  private cameraPosLoc: WebGLUniformLocation;
  private sunColLoc: WebGLUniformLocation;

  private sceneAmbientLoc: WebGLUniformLocation;

  constructor() {
    super(lit_color_shader_vs, lit_color_shader_fs);

    this.start();
    /* Materices */
    this.projectionLoc = this.getUniformLocation("projectionMat");
    this.tranformationLoc = this.getUniformLocation("tranformationMat");

    /* Material */
    this.sceneAmbientLoc = this.getUniformLocation("sceneAmbient");
    this.diffuseLoc = this.getUniformLocation("material.diffuse");
    this.specularLoc = this.getUniformLocation("material.specular");
    this.shininessLoc = this.getUniformLocation("material.shininess");

    /* Sun */
    this.sunPosLoc = this.getUniformLocation("sunPosition");
    this.cameraPosLoc = this.getUniformLocation("cameraPosition");
    this.sunColLoc = this.getUniformLocation("sunColor");
    this.stop();
  }

  public loadMaterial(material: Material): void {
    gl.uniform3fv(this.diffuseLoc, material.diffuse);
    gl.uniform3fv(this.specularLoc, material.specular);
    gl.uniform1f(this.shininessLoc, material.shininess);
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

  public loadSceneAmbient(sceneAmbient: number) {
    gl.uniform1f(this.sceneAmbientLoc, sceneAmbient);
  }
}
