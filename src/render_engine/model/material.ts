import { vec3 } from "gl-matrix";
import { MaterialShader } from "../shader/shader_config";

class MaterialDefault {
  public static readonly color = vec3.fromValues(0.5, 0.5, 0.5);
  public static readonly shininess = 16.0;
  public static readonly intensity = 1;
  public static readonly shader = MaterialShader.LIT_MATERIAL_COLOR_SHADER;
}

export interface IMaterial {
  ambient?: vec3;
  diffuse?: vec3;
  specular?: vec3;
  shininess?: number;
  ka?: number;
  kd?: number;
  ks?: number;
  materialShader?: MaterialShader;
}

export default class Material {
  public ambient: vec3;
  public diffuse: vec3;
  public specular: vec3;
  public shininess: number;
  public ka: number;
  public kd: number;
  public ks: number;
  public materialShader: MaterialShader;

  constructor(iMaterial?: IMaterial) {
    if (iMaterial == null) iMaterial = {};

    this.materialShader = iMaterial.materialShader || MaterialDefault.shader;

    switch (+this.materialShader) {
      case MaterialShader.LIT_MATERIAL_COLOR_SHADER:
        this.ambient = iMaterial.ambient || MaterialDefault.color;
        this.diffuse = iMaterial.diffuse || MaterialDefault.color;
        this.specular = iMaterial.specular || MaterialDefault.color;
        this.shininess = iMaterial.shininess || MaterialDefault.shininess;
        this.ka = iMaterial.ka || MaterialDefault.intensity;
        this.kd = iMaterial.kd || MaterialDefault.intensity;
        this.ks = iMaterial.ks || MaterialDefault.intensity;
        break;

      case MaterialShader.UNLIT_MATERIAL_COLOR_SHADER:
        this.ambient = iMaterial.ambient || MaterialDefault.color;
        this.ka = iMaterial.ka || MaterialDefault.intensity;
        break;
    }
  }
}
