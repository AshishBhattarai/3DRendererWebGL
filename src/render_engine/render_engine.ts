import { gl } from "./ogl_globals";
import { vec3, mat4 } from "gl-matrix";
import Mesh from "./model/mesh";
import Model from "./model/model";
import LitColorShader from "./shader/lit_color_shader";
import DisplayManager from "./renderer/display_manager";
import { LitColorRenderer } from "./renderer/lit_color_renderer";

export default class RenderEngine {
  private testModel: Model;
  private testPostion: vec3;
  private testTranform: mat4;

  private litColorShader: LitColorShader;
  private litColorRenderer: LitColorRenderer;
  private prespectiveProj: mat4;
  private sunPosition: vec3;
  private sunColor: vec3;

  private sceneAmbient: number;

  constructor() {
    this.sceneAmbient = 0.2;
    var vpSize = DisplayManager.getInstance().getViewportSize();
    this.testModel = new Model();
    this.litColorShader = new LitColorShader();
    this.litColorRenderer = new LitColorRenderer(this.litColorShader);
    this.prespectiveProj = mat4.create();
    mat4.perspective(
      this.prespectiveProj,
      45.0,
      vpSize[0] / vpSize[1],
      0.1,
      1000.0
    );

    this.testPostion = vec3.fromValues(0, 0, -5);
    this.testTranform = mat4.create();
    mat4.translate(this.testTranform, this.testTranform, this.testPostion);

    this.sunPosition = vec3.fromValues(0, 0, 5);
    this.sunColor = vec3.fromValues(1, 1, 1);

    this.litColorShader.start();
    this.litColorShader.loadSun(this.sunPosition, this.sunColor);
    this.litColorShader.loadProjection(this.prespectiveProj);
    this.litColorShader.loadCameraPosition(vec3.fromValues(0, 0, 0));
    this.litColorShader.loadSceneAmbient(this.sceneAmbient);
    this.litColorShader.stop();

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
