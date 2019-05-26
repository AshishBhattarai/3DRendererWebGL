import LitColorShader from "../shader/lit_color_shader";
import Model from "../model/model";
import LitTextureShader from "../shader/lit_texture_shader";
import Entity from "../Enitity/entity";
import Terrain from "../terrain/terrain";
import AnimModel from "../model/anim_model";
import LitTextureAnimShader from "../shader/lit_texture_anim_shader";
import SAnimator from "../model/sanimator";
import AnimEntity from "../Enitity/anim_entity";
import LitColorAnimShader from "../shader/lit_color_anim_shader";

export default class Renderer {
  private litColorShader: LitColorShader;
  private litTextureShader: LitTextureShader;
  private litTextureAnimShader: LitTextureAnimShader;
  private litColorAnimShader: LitColorAnimShader;
  private animator = SAnimator.getInstance();

  constructor(
    litColorShader: LitColorShader,
    litTextureShader: LitTextureShader,
    litTextureAnimShader: LitTextureAnimShader,
    litColorAnimShader: LitColorAnimShader
  ) {
    this.litColorShader = litColorShader;
    this.litTextureShader = litTextureShader;
    this.litTextureAnimShader = litTextureAnimShader;
    this.litColorAnimShader = litColorAnimShader;
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
    this.litColorShader.start();
    this.litColorShader.loadMaterial(model.material);
    for (let entity of entites) {
      this.litColorShader.loadTranformation(entity.getTransMatrix());
      model.mesh.drawMesh();
    }
  }

  public renderTerrain(terrains: Terrain[]) {
    this.litTextureShader.start();
    for (let terrain of terrains) {
      let mesh = terrain.getMesh();
      this.litTextureShader.loadMaterial(terrain.getMaterial());
      this.litTextureShader.loadTranformation(terrain.getTransMat());
      mesh.bindMesh();
      mesh.drawMesh();
    }
  }

  public renderLitTextureAnim(
    delta: number,
    animModel: AnimModel,
    entites: AnimEntity[]
  ) {
    animModel.mesh.bindMesh();
    this.litTextureAnimShader.start();
    this.litTextureAnimShader.loadMaterial(animModel.material);
    for (let entity of entites) {
      this.animator.processAnimation(delta, entity, animModel);
      this.litTextureAnimShader.loadBoneTransforms(
        animModel.getBoneTranforms()
      );
      this.litTextureAnimShader.loadTranformation(entity.getTransMatrix());
      animModel.mesh.drawMesh();
    }
  }

  public renderLitColorAnim(
    delta: number,
    animModel: AnimModel,
    entites: AnimEntity[]
  ) {
    animModel.mesh.bindMesh();
    this.litColorAnimShader.start();
    this.litColorAnimShader.loadMaterial(animModel.material);
    for (let entity of entites) {
      this.animator.processAnimation(delta, entity, animModel);
      this.litColorAnimShader.loadBoneTransforms(animModel.getBoneTranforms());
      this.litColorAnimShader.loadTranformation(entity.getTransMatrix());
      animModel.mesh.drawMesh();
    }
  }
}
