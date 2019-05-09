import Mesh from "./mesh";
import Material from "./material";
import RenderDefaults from "../render_defaults";

export interface IModel {
  mesh?: Mesh;
  material?: Material;
  name: string;
}

export default class Model {
  public mesh: Mesh;
  public material?: Material;
  private name: string;

  constructor(iModel: IModel) {
    this.name = iModel.name;
    this.mesh = iModel.mesh || RenderDefaults.getInstance().getMesh();
    this.material = iModel.material || new Material();
  }

  public getName(): string {
    return name;
  }

  public release() {
    this.mesh.release();
    this.material.release()
  }
}
