import Mesh from "../model/mesh";
import Skybox from "../model/skybox";
import RenderDefaults from "../render_defaults";
import { gl } from "../ogl_globals";
import SkyboxShader from "../shader/skybox_shader";
import { mat4 } from "gl-matrix";

export default class SkyboxRenderer {
  private mesh: Mesh;
  private shader: SkyboxShader;

  constructor(shader: SkyboxShader) {
    this.shader = shader;
    this.mesh = RenderDefaults.getInstance().getMesh();
  }

  render(skybox: Skybox, viewMat: mat4) {
    gl.depthFunc(gl.LEQUAL);
    gl.activeTexture(gl.TEXTURE0);
    skybox.bindCubemap();
    this.shader.start();
    this.shader.loadTranformation(viewMat, skybox.rpm, skybox.fogEnable);
    this.mesh.bindMesh();
    this.mesh.drawMesh();
    gl.depthFunc(gl.LESS);
  }
}
