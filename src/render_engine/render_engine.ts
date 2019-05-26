import { gl } from "./ogl/oglGlobals";
import { vec3, mat4, vec2 } from "gl-matrix";
import Model from "./model/model";
import LitColorShader from "./shader/lit_color_shader";
import DisplayManager from "./renderer/display_manager";
import GlobalVSBuffer from "./shader/global_vs_buffer";
import GlobalFSBuffer from "./shader/global_fs_buffer";
import { ShaderConfig, MaterialShader } from "./shader/shader_config";
import LitTextureShader from "./shader/lit_texture_shader";
import Renderer from "./renderer/renderer";
import Entity from "./Enitity/entity";
import Shader from "./shader/shader";
import Camera from "./Enitity/camera";
import Terrain from "./terrain/terrain";
import Skybox from "./model/skybox";
import SkyboxShader from "./shader/skybox_shader";
import SkyboxRenderer from "./renderer/skybox_renderer";
import LitTextureAnimShader from "./shader/lit_texture_anim_shader";
import AnimModel from "./model/anim_model";
import SAnimator from "./model/sanimator";
import AnimEntity from "./Enitity/anim_entity";
import LitColorAnimShader from "./shader/lit_color_anim_shader";

export default class RenderEngine {
  /* Default values */
  private static readonly FOG_DENSITY = 0.0038;
  private static readonly FOG_GRADIENT = 20.0;

  /* Data */
  private modelsMap: Map<string, Model> = new Map();
  /*Entities */
  private coloredEntityMap: Map<string, Entity[]> = new Map();
  private texturedEntityMap: Map<string, Entity[]> = new Map();
  private coloredAnimEntityMap: Map<string, Entity[]> = new Map();
  private texturedAnimEntityMap: Map<string, Entity[]> = new Map();
  private terrians: Terrain[];

  /* Shaders */
  private litColorShader: LitColorShader;
  private litTextureShader: LitTextureShader;
  private litTextureAnimShader: LitTextureAnimShader;
  private litColorAnimShader: LitColorAnimShader;
  private skyboxShader: SkyboxShader;

  /* Renderer */
  private renderer: Renderer;
  private skyboxRenderer: SkyboxRenderer;

  /* Render Data */
  private globalVSBuffer: GlobalVSBuffer;
  private globalFSBuffer: GlobalFSBuffer;
  private prespectiveProj: mat4;
  private sceneAmbient: number;
  private sunPosition: vec3;
  private sunColor: vec3;
  private skybox: Skybox;
  private fogColor: vec3;

  private animator: SAnimator = SAnimator.getInstance();

  constructor() {
    this.litColorShader = new LitColorShader();
    this.litTextureShader = new LitTextureShader();
    this.litTextureAnimShader = new LitTextureAnimShader();
    this.litColorAnimShader = new LitColorAnimShader();
    this.skyboxShader = new SkyboxShader();
    this.renderer = new Renderer(
      this.litColorShader,
      this.litTextureShader,
      this.litTextureAnimShader,
      this.litColorAnimShader
    );
    this.skyboxRenderer = new SkyboxRenderer(this.skyboxShader);
    this.globalFSBuffer = new GlobalFSBuffer();
    this.globalVSBuffer = new GlobalVSBuffer();
    this.sceneAmbient = 0.2;
    var displayManager = DisplayManager.getInstance();
    var vpSize = displayManager.getViewportSize();
    this.prespectiveProj = mat4.create();
    mat4.perspective(
      this.prespectiveProj,
      45.0,
      vpSize[0] / vpSize[1],
      0.1,
      350
    );
    displayManager.onCanvasResize((width, height) => {
      mat4.perspective(this.prespectiveProj, 45.0, width / height, 0.1, 1000.0);
      this.globalVSBuffer.setProjectionMatrix(this.prespectiveProj);
    });

    this.bindUniformBuffer(
      ShaderConfig.GlobalVSBuffer,
      this.globalVSBuffer.getBindingPoint(),
      [
        this.litTextureShader,
        this.litColorShader,
        this.litTextureAnimShader,
        this.litColorAnimShader,
        this.skyboxShader
      ]
    );

    this.bindUniformBuffer(
      ShaderConfig.GlobalFSBuffer,
      this.globalFSBuffer.getBindingPoint(),
      [
        this.litTextureShader,
        this.litColorShader,
        this.litTextureAnimShader,
        this.litColorAnimShader,
        this.skyboxShader
      ]
    );

    this.sunPosition = vec3.fromValues(0, 500, 10);
    this.sunColor = vec3.fromValues(0.7, 0.7, 0.7);

    this.fogColor = vec3.fromValues(1, 1, 1);

    this.globalFSBuffer.setSceneAmbient(this.sceneAmbient);
    this.globalFSBuffer.setSunColor(this.sunColor);
    this.globalVSBuffer.setProjectionMatrix(this.prespectiveProj);
    this.globalVSBuffer.setSunPosition(this.sunPosition);
    this.globalFSBuffer.setFogColor(this.fogColor);
    this.globalVSBuffer.setFogDensityGradient(
      vec2.fromValues(RenderEngine.FOG_DENSITY, RenderEngine.FOG_GRADIENT)
    );

    console.log(gl.getError());
  }

  private bindUniformBuffer(name: string, point: number, list: Shader[]) {
    list.forEach(shader => {
      shader.setUniformBlockBinding(name, point);
    });
  }

  public prepare(): void {
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(1, 0, 0, 1);
  }

  public renderFrame(delta: number, camera: Camera): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.globalVSBuffer.setCameraPosition(camera.getPosition());
    this.globalVSBuffer.setViewMatrix(camera.getViewMatrix());

    // Render Color Models
    this.coloredEntityMap.forEach((entites: Entity[], name: string) => {
      let model = this.modelsMap.get(name);
      this.renderer.renderLitColor(model, entites);
    });

    // Render Texture Models
    this.texturedEntityMap.forEach((entites: Entity[], name: string) => {
      let model = this.modelsMap.get(name);
      this.renderer.renderLitTexture(model, entites);
    });

    // Render Animated Texture Models
    this.texturedAnimEntityMap.forEach(
      (entites: AnimEntity[], name: string) => {
        let model = this.modelsMap.get(name);
        this.renderer.renderLitTextureAnim(delta, model as AnimModel, entites);
      }
    );

    // Render Animated Color Models
    this.coloredAnimEntityMap.forEach((entites: AnimEntity[], name: string) => {
      let model = this.modelsMap.get(name);
      this.renderer.renderLitColorAnim(delta, model as AnimModel, entites);
    });

    // Render Terrains
    this.renderer.renderTerrain(this.terrians);
    this.skyboxRenderer.render(this.skybox, camera.getViewMatrix());

    this.coloredEntityMap.clear();
    this.texturedEntityMap.clear();
    this.coloredAnimEntityMap.clear();
    this.texturedAnimEntityMap.clear();
  }

  public addModel(model: Model, name: string) {
    this.modelsMap.set(name, model);
  }

  /* Removes the model from the list and releases it */
  public removeModel(name: string) {
    if (this.modelsMap.has(name)) {
      let model = this.modelsMap.get(name);
      model.release();
    }
  }

  public processEntities(entities: Entity[] | AnimEntity[]) {
    for (let entity of entities) {
      if (!this.modelsMap.has(entity.modelName)) return;
      let name = entity.modelName;
      let model = this.modelsMap.get(entity.modelName);
      if (entity instanceof AnimEntity) {
        /* Animated entity */
        if (entity.isAnimate) {
          switch (model.material.materialShader) {
            case MaterialShader.LIT_MATERIAL_TEXTURE_SHADER:
              if (!this.texturedAnimEntityMap.has(name))
                this.texturedAnimEntityMap.set(name, []);
              this.texturedAnimEntityMap.get(name).push(entity);
              break;
            case MaterialShader.LIT_MATERIAL_COLOR_SHADER:
              if (!this.coloredAnimEntityMap.has(name))
                this.coloredAnimEntityMap.set(name, []);
              this.coloredAnimEntityMap.get(name).push(entity);
          }
          continue;
        }
      }
      /* Non Animated entites */
      switch (model.material.materialShader) {
        case MaterialShader.LIT_MATERIAL_TEXTURE_SHADER:
          if (!this.texturedEntityMap.has(name))
            this.texturedEntityMap.set(name, []);
          this.texturedEntityMap.get(name).push(entity);
          break;
        case MaterialShader.LIT_MATERIAL_COLOR_SHADER:
          if (!this.coloredEntityMap.has(name))
            this.coloredEntityMap.set(name, []);
          this.coloredEntityMap.get(name).push(entity);
      }
    }
  }

  public processTerrains(terrains: Terrain[]) {
    this.terrians = terrains;
  }

  public setSkybox(skybox: Skybox) {
    this.skybox = skybox;
  }
}
