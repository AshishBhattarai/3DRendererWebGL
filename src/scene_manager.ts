import Scene from "./scene";
import Terrain from "./render_engine/terrain/terrain";
import { vec2, vec3 } from "gl-matrix";
import Camera from "./render_engine/Enitity/camera";

type OnSceneChange = (scene: Scene) => void;

export default class SceneManager {
  private static instance = new SceneManager();

  private onSceneChangeCallbacks: OnSceneChange[] = [];
  private sceneMap: Map<string, Scene> = new Map();
  private currentSceneName: string = "default";

  constructor() {
    if (SceneManager.instance) {
      throw new Error(
        "Error: Instatiation failed: use SceneManager.getInstance"
      );
    }
  }

  public loadDefaultScene() {
    /* default scene */
    if (!this.sceneMap.has("default")) {
      var scene = new Scene({
        name: "default",
        terrains: [new Terrain(vec2.fromValues(0, 0), 400, 4, 50)],
        camera: new Camera(vec3.fromValues(-200, 10, -200))
      });
      this.sceneMap.set(this.currentSceneName, scene);
    }
  }
  public addScene(scene: Scene) {
    this.sceneMap.set(scene.getName(), scene);
  }

  public getCurrentScene(): Scene {
    return this.sceneMap.get(this.currentSceneName);
  }

  public getCureentSceneName(): string {
    return this.currentSceneName;
  }

  public setCurrentScene(sname: string) {
    if (this.sceneMap.has(sname)) {
      this.currentSceneName = sname;
      this.onSceneChangeCallbacks.forEach(callback => {
        callback(this.sceneMap.get(sname));
      });
    }
  }

  public getAllScenes(): Scene[] {
    return Array.from(this.sceneMap.values());
  }

  public getAllSceneNames(): string[] {
    return Array.from(this.sceneMap.keys());
  }

  public onSceneChangeListener(onSceneChange: OnSceneChange) {
    this.onSceneChangeCallbacks.push(onSceneChange);
  }

  public static getInstance(): SceneManager {
    return SceneManager.instance;
  }
}
