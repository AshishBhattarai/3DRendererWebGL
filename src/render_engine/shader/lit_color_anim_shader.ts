import { ShaderConfig } from "./shader_config";
import { gl } from "../ogl/oglGlobals";
import { mat4 } from "gl-matrix";
import LitColorShader from "./lit_color_shader";
import { lit_color_anim_shader_vs } from "./glsl/shader_source";

export default class LitColorAnimShader extends LitColorShader {
  private boneTransformsLocation: WebGLUniformLocation[] = [];

  constructor() {
    super(lit_color_anim_shader_vs);
    /* get bone transform locations */
    for (let i = 0; i < ShaderConfig.MAX_BONES; ++i) {
      this.boneTransformsLocation.push(
        this.getUniformLocation("boneTransforms[" + i + "]")
      );
    }
  }

  public loadBoneTransforms(boneTransforms: mat4[]) {
    for (let i = 0; i < boneTransforms.length; ++i) {
      gl.uniformMatrix4fv(
        this.boneTransformsLocation[i],
        false,
        boneTransforms[i]
      );
    }
  }
}
