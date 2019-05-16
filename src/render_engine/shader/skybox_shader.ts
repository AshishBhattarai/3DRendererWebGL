import Shader from "./shader";
import { skybox_shader_vs, skybox_shader_fs } from "./glsl/shader_source";
import { gl } from "../ogl/oglGlobals";
import { mat4, mat3 } from "gl-matrix";
import DisplayManager from "../renderer/display_manager";

export default class SkyboxShader extends Shader {
  private transformationLoc: WebGLUniformLocation;
  private enableFog: WebGLUniformLocation;

  constructor() {
    super(skybox_shader_vs, skybox_shader_fs);
    this.start();
    gl.uniform1i(this.getUniformLocation("skyboxCubemap"), 0);
    this.transformationLoc = this.getUniformLocation("transformation");
    this.enableFog = this.getUniformLocation("enableFog");
    this.stop();
  }

  public loadTranformation(viewMat: mat4, rpm: number, enableFog: boolean) {
    let transformation: mat4 = mat4.create();
    mat4.identity(transformation);
    mat4.multiply(transformation, transformation, viewMat);
    if (rpm != 0.0) {
      let rot = (rpm * DisplayManager.getInstance().getFrameTime()) / 60000.0;
      transformation = mat4.rotateY(transformation, transformation, rot);
    }
    let sendMat: mat3 = mat3.create();
    mat3.normalFromMat4(sendMat, transformation);
    gl.uniformMatrix3fv(this.transformationLoc, false, sendMat);
    gl.uniform1i(this.enableFog, enableFog ? 1 : 0);
  }
}
