import Entity from "./render_engine/Enitity/entity";
import Terrain from "./render_engine/terrain/terrain";
import Camera from "./render_engine/Enitity/camera";
import Skybox from "./render_engine/model/skybox";
import RenderDefaults from "./render_engine/render_defaults";

type onKeyDown = (code: string) => void;
type onPrepare = () => void;
type onFrameLoop = (frameTime: number) => void;

export interface IScene {
  name: string;
  camera?: Camera;
  entities?: Entity[];
  terrains?: Terrain[];
  skybox?: Skybox;
  onKeyDown?: onKeyDown;
  onPrepare?: onPrepare;
  onFrameLoop?: onFrameLoop;
}

export default class Scene {
  na(na: any) {
    throw new Error("Method not implemented.");
  }
  private name: string;
  public camera: Camera;
  public entities: Entity[];
  public terrains: Terrain[];
  public skybox: Skybox;
  public onKeyDown: onKeyDown;
  public onPrepare: onPrepare;
  public onFrameLoop: onFrameLoop;

  constructor(iScene: IScene) {
    this.name = iScene.name;
    this.camera = iScene.camera || new Camera();
    this.entities = iScene.entities || [];
    this.terrains = iScene.terrains || [];
    this.skybox = iScene.skybox || RenderDefaults.getInstance().getSkybox();
    this.onKeyDown = iScene.onKeyDown || ((code: string) => {});
    this.onPrepare = iScene.onPrepare || (() => {});
    this.onFrameLoop = iScene.onFrameLoop || ((frameTime: number) => {});
  }

  public getName(): string {
    return this.name;
  }
}
