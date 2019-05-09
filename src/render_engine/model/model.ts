import Mesh from "./mesh";
import Material from "./material";
import RenderDefaults from "../render_defaults";

export interface IModel {
  mesh?: Mesh;
  material?: Material;
}

export default class Model {
  public mesh: Mesh;
  public material?: Material;

  constructor(iModel: IModel) {
    this.mesh = iModel.mesh || RenderDefaults.getInstance().getMesh();
    this.material = iModel.material || new Material();
  }

  public release() {
    if (this.mesh) this.mesh.release();
  }
}
