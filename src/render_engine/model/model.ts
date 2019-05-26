import Mesh from "./mesh";
import Material from "./material";

export interface IModel {
  name: string;
  mesh: Mesh;
  material?: Material;
}

export default class Model {
  private name: string;
  public mesh: Mesh;
  public material?: Material;

  constructor(iModel: IModel) {
    this.name = iModel.name;
    this.mesh = iModel.mesh;
    this.material = iModel.material || new Material();
  }

  public getName(): string {
    return name;
  }

  public release() {
    this.mesh.release();
    this.material.release();
  }
}
