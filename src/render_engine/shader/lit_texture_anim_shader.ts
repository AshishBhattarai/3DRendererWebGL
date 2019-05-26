import { lit_texture_anim_shader_vs } from "./glsl/shader_source";
import LitTextureShader from "./lit_texture_shader";
import { ShaderConfig } from "./shader_config";
import { gl } from "../ogl/oglGlobals";
import { mat4 } from "gl-matrix";

export default class LitTextureAnimShader extends LitTextureShader {
  private boneTransformsLocation: WebGLUniformLocation[] = [];

  constructor() {
    super(lit_texture_anim_shader_vs);
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
