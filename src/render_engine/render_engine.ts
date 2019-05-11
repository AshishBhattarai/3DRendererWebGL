import { gl } from "./ogl_globals";
import { vec3, mat4 } from "gl-matrix";
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

export default class RenderEngine {
  /* Data */
  private ColorModels: Map<string, Model> = new Map<string, Model>();
  private TextureModels: Map<string, Model> = new Map<string, Model>();
  private ColorModelsMap: Map<string, Entity[]> = new Map<string, Entity[]>();
  private TextureModelsMap: Map<string, Entity[]> = new Map<string, Entity[]>();
  private terrians: Terrain[];

  /* Shaders */
  private litColorShader: LitColorShader;
  private litTextureShader: LitTextureShader;
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

  constructor() {
    this.litColorShader = new LitColorShader();
    this.litTextureShader = new LitTextureShader();
    this.skyboxShader = new SkyboxShader();
    this.renderer = new Renderer(this.litColorShader, this.litTextureShader);
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
      1000.0
    );
    displayManager.onCanvasResize((width, height) => {
      mat4.perspective(this.prespectiveProj, 45.0, width / height, 0.1, 1000.0);
      this.globalVSBuffer.setProjectionMatrix(this.prespectiveProj);
    });

    this.bindUniformBuffer(
      ShaderConfig.GlobalVSBuffer,
      this.globalVSBuffer.getBindingPoint(),
      [this.litTextureShader, this.litColorShader, this.skyboxShader]
    );

    this.bindUniformBuffer(
      ShaderConfig.GlobalFSBuffer,
      this.globalFSBuffer.getBindingPoint(),
      [this.litTextureShader, this.litColorShader, this.skyboxShader]
    );

    this.sunPosition = vec3.fromValues(0, 500, 10);
    this.sunColor = vec3.fromValues(0.7, 0.7, 0.7);

    this.fogColor = vec3.fromValues(1, 1, 1);

    this.globalFSBuffer.setSceneAmbient(this.sceneAmbient);
    this.globalFSBuffer.setSunColor(this.sunColor);
    this.globalVSBuffer.setProjectionMatrix(this.prespectiveProj);
    this.globalVSBuffer.setSunPosition(this.sunPosition);
    this.globalFSBuffer.setFogColor(this.fogColor);

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

  public renderFrame(frameTime: number, camera: Camera): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.globalVSBuffer.setCameraPosition(camera.getPosition());
    this.globalVSBuffer.setViewMatrix(camera.getViewMatrix());

    // Render Color Models
    this.ColorModels.forEach((model, name) => {
      let list = this.ColorModelsMap.get(name);
      this.renderer.renderLitColor(model, list);
      list.splice(0, list.length);
    });

    // Render Texture Models
    this.TextureModels.forEach((model, name) => {
      let list = this.TextureModelsMap.get(name);
      this.renderer.renderLitTexture(model, list);
      list.splice(0, list.length);
    });

    // Render Terrains
    this.renderer.renderTerrain(this.terrians);

    this.skyboxRenderer.render(this.skybox, camera.getViewMatrix());
  }

  public addModel(model: Model, name: string) {
    switch (model.material.materialShader) {
      case MaterialShader.LIT_MATERIAL_COLOR_SHADER:
        this.ColorModels.set(name, model);
        this.ColorModelsMap.set(name, []);
        break;

      case MaterialShader.LIT_MATERIAL_TEXTURE_SHADER:
        this.TextureModels.set(name, model);
        this.TextureModelsMap.set(name, []);
        break;
    }
  }

  /* Removes the model from the list and releases it */
  public removeModel(name: string) {
    var model: Model;
    if (this.ColorModels.has(name)) {
      model = this.ColorModels.get(name);
      this.ColorModels.delete(name);
      this.TextureModelsMap.delete(name);
      model.release();
    } else if (this.TextureModels.has(name)) {
      model = this.TextureModels.get(name);
      this.ColorModels.delete(name);
      this.TextureModelsMap.delete(name);
      model.release();
    }
  }

  public processEntities(entities: Entity[]) {
    for (let entity of entities) {
      let name = entity.modelName;
      if (this.ColorModels.has(name)) {
        this.ColorModelsMap.get(name).push(entity);
      } else if (this.TextureModels.has(name)) {
        this.TextureModelsMap.get(name).push(entity);
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
