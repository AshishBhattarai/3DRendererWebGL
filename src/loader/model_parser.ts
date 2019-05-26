import Mesh from "../render_engine/model/mesh";
import Bone from "../render_engine/model/bone";

export default class ModelParser {
  protected hasTexCoords: boolean;
  protected hasNormals: boolean;
  protected parseSuccess: boolean;
  protected isRigged: boolean;
  protected hasAnimation: boolean;

  protected meshes: Mesh[];
  protected rootBone: Bone;
  protected boneCount: number;

  constructor() {
    this.hasNormals = false;
    this.hasTexCoords = false;
    this.parseSuccess = false;
    this.isRigged = false;
    this.hasAnimation = false;
    this.boneCount = 0;
    this.meshes = [];
  }

  public isSuccess(): boolean {
    return this.parseSuccess;
  }

  public getMeshes(): Mesh[] {
    return this.meshes;
  }

  public getRootBone(): Bone {
    return this.rootBone;
  }

  public getboneCount(): number {
    return this.boneCount;
  }

  public getHasAnimation(): boolean {
    return this.hasAnimation;
  }
}
