import { gl } from "./ogl_globals";
import { vec3, mat4 } from "gl-matrix";
import Mesh from "./model/mesh";
import Model from "./model/model";
import LitColorShader from "./shader/lit_color_shader";
import DisplayManager from "./renderer/display_manager";
import { LitColorRenderer } from "./renderer/lit_color_renderer";
import GlobalVSBuffer from "./shader/global_vs_buffer";
import GlobalFSBuffer from "./shader/global_fs_buffer";
import { ShaderConfig } from "./shader/shader_config";

export default class RenderEngine {
  private testModel: Model;
  private testPostion: vec3;
  private testTranform: mat4;

  private litColorShader: LitColorShader;
  private litColorRenderer: LitColorRenderer;
  private globalVSBuffer: GlobalVSBuffer;
  private globalFSBuffer: GlobalFSBuffer;
  private prespectiveProj: mat4;
  private sunPosition: vec3;
  private sunColor: vec3;

  private sceneAmbient: number;

  constructor() {
    this.testModel = new Model();
    this.litColorShader = new LitColorShader();
    this.litColorRenderer = new LitColorRenderer(this.litColorShader);
    this.globalFSBuffer = new GlobalFSBuffer();
    this.globalVSBuffer = new GlobalVSBuffer();

    this.sceneAmbient = 0.2;
    var vpSize = DisplayManager.getInstance().getViewportSize();
    this.prespectiveProj = mat4.create();
    mat4.perspective(
      this.prespectiveProj,
      45.0,
      vpSize[0] / vpSize[1],
      0.1,
      1000.0
    );

    this.litColorShader.setUniformBlockBinding(
      ShaderConfig.GlobalVSBuffer,
      this.globalVSBuffer.getBindingPoint()
    );
    this.litColorShader.setUniformBlockBinding(
      ShaderConfig.GlobalFSBuffer,
      this.globalFSBuffer.getBindingPoint()
    );

    this.testPostion = vec3.fromValues(0, 0, -5);
    this.testTranform = mat4.create();
    mat4.translate(this.testTranform, this.testTranform, this.testPostion);

    this.sunPosition = vec3.fromValues(0, 0, 5);
    this.sunColor = vec3.fromValues(1, 1, 1);

    this.globalFSBuffer.setSceneAmbient(this.sceneAmbient);
    this.globalFSBuffer.setSunColor(this.sunColor);
    this.globalVSBuffer.setCameraPosition(vec3.fromValues(0, 0, 0));
    this.globalVSBuffer.setProjectionMatrix(this.prespectiveProj);
    this.globalVSBuffer.setSunPosition(this.sunPosition);

    console.log(gl.getError());
  }

  public prepare(): void {
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
  }

  public renderFrame(framTime: number): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.identity(this.testTranform);
    mat4.translate(this.testTranform, this.testTranform, this.testPostion);
    mat4.rotateY(
      this.testTranform,
      this.testTranform,
      (framTime / 1000) * 1.5 * 0.5
    );

    this.litColorRenderer.render(this.testTranform, this.testModel);
  }

  public seRenderMesh(mesh: Mesh) {
    this.testModel.mesh = mesh;
  }
}
