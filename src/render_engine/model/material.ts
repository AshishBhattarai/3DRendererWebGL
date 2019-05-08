import { vec3 } from "gl-matrix";
import { MaterialShader } from "../shader/shader_config";
import Texture from "./texture";

class MaterialDefault {
  public static readonly colorW = vec3.fromValues(1, 1, 1);
  public static readonly colorB = vec3.fromValues(0, 0, 0);
  public static readonly shininess = 16.0;
  public static readonly intensity = 1;
  public static readonly shader = MaterialShader.LIT_MATERIAL_COLOR_SHADER;
}

export interface IMaterial {
  diffuse?: vec3;
  specular?: vec3;
  shininess?: number;
  diffuseMap?: Texture;
  specularMap?: Texture;
  emissionMap?: Texture;
  materialShader?: MaterialShader;
}

export default class Material {
  public name: String;

  // colors
  public diffuse: vec3;
  public specular: vec3;
  public emission: vec3;

  // factors
  public shininess: number;

  // textures
  public diffuseMap: Texture;
  public specularMap: Texture;
  public emissionMap: Texture;

  public materialShader: MaterialShader;

  constructor(iMaterial?: IMaterial) {
    if (iMaterial == null) iMaterial = {};

    this.materialShader = iMaterial.materialShader || MaterialDefault.shader;
    this.shininess = iMaterial.shininess || MaterialDefault.shininess;

    switch (+this.materialShader) {
      case MaterialShader.LIT_MATERIAL_COLOR_SHADER:
        this.diffuse = iMaterial.diffuse || MaterialDefault.colorW;
        this.specular = iMaterial.specular || MaterialDefault.colorB;
        break;
      case MaterialShader.LIT_MATERIAL_TEXTURE_SHADER:
        this.diffuseMap = iMaterial.diffuseMap;
        // this.specularMap = iMaterial.specularMap || iMaterial.diffuseMap;
        break;
    }
  }

  public release() {
    if (this.diffuseMap) {
      this.diffuseMap.release();
    }
    if (this.specularMap) {
      this.specularMap.release();
    }
    if (this.emissionMap) {
      this.emissionMap.release();
    }
  }
}
