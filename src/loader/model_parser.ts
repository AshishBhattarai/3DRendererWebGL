import Mesh from "../render_engine/model/mesh";

export default class ModelParser {
  protected hasTexCoords: boolean;
  protected hasNormals: boolean;
  protected parseSuccess: boolean;

  protected meshes: Mesh[];

  constructor() {
    this.hasNormals = false;
    this.hasTexCoords = false;
    this.parseSuccess = true;
    this.meshes = [];
  }

  public isSuccess(): boolean {
    return this.parseSuccess;
  }

  public getMeshes(): Mesh[] {
    return this.meshes;
  }
}
