import LitColorShader from "../shader/lit_color_shader";
import Model from "../model/model";
import LitTextureShader from "../shader/lit_texture_shader";
import Entity from "../Enitity/entity";

export default class Renderer {
  litColorShader: LitColorShader;
  litTextureShader: LitTextureShader;

  constructor(
    litColorShader: LitColorShader,
    litTextureShader: LitTextureShader
  ) {
    this.litColorShader = litColorShader;
    this.litTextureShader = litTextureShader;
  }

  public renderLitTexture(model: Model, entites: Entity[]) {
    model.mesh.bindMesh();
    this.litTextureShader.start();
    this.litTextureShader.loadMaterial(model.material);
    for (let entity of entites) {
      this.litTextureShader.loadTranformation(entity.getTransMatrix());
      model.mesh.drawMesh();
    }
  }

  public renderLitColor(model: Model, entites: Entity[]) {
    model.mesh.bindMesh();
    this.litColorShader.loadMaterial(model.material);
    for (let entity of entites) {
      this.litColorShader.loadTranformation(entity.getTransMatrix());
      model.mesh.drawMesh();
    }
  }
}
