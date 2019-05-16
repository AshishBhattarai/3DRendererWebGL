import Texture, { TextureType } from "./model/texture";
import Mesh, { MeshFlags } from "./model/mesh";
import Skybox from "./model/skybox";
import { gl } from "./ogl/oglGlobals";

// Default textures / models for renderer

export default class RenderDefaults {
  private static readonly NUM_RES = 4;
  private static instance = new RenderDefaults();
  private checkerTexture: Texture;
  private blackMapTexture: Texture;
  private skybox: Skybox;
  private mesh: Mesh;
  private loadedCount: number = RenderDefaults.NUM_RES;

  private loadCompleteCallback: () => void;

  constructor() {
    if (RenderDefaults.instance) {
      throw new Error(
        "Error: Instatiation failed: use RenderDefaults.getInstance"
      );
    }
  }

  private resLoadComplete() {
    --this.loadedCount;
    if (this.loadedCount == 0) {
      this.loadCompleteCallback();
    }
  }

  private loadTexture() {
    var imageA = new Image();
    imageA.onload = () => {
      this.checkerTexture = new Texture(imageA, TextureType.DEFAULT_MAP);
      this.checkerTexture.setTextureFilter(
        gl.NEAREST,
        gl.NEAREST_MIPMAP_NEAREST
      );
      this.resLoadComplete();
    };
    imageA.src = "res/defaults/checker.bmp";

    var imageB = new Image();
    imageB.onload = () => {
      this.blackMapTexture = new Texture(imageB, TextureType.DEFAULT_MAP);
      this.resLoadComplete();
    };
    imageB.src = "res/defaults/bMap.bmp";
  }

  private loadMesh(): void {
    var vertices = new Float32Array([
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0, // (front)
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0, // (right)
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0, // (top)
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0, // (left)
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0, // (bottom)
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0
    ]);

    var indices = new Uint32Array([
      0,
      1,
      2,
      2,
      3,
      0, //  (front)
      4,
      5,
      6,
      6,
      7,
      4, //  (right)
      8,
      9,
      10,
      10,
      11,
      8, //  (top)
      12,
      13,
      14,
      14,
      15,
      12, //  (left)
      16,
      17,
      18,
      18,
      19,
      16, //  (bottom)
      20,
      21,
      22,
      22,
      23,
      20 //  (back)
    ]);

    var normals = new Float32Array([
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,

      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,

      1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,

      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,

      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,
      0.0,
      -1.0,
      0.0,

      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0
    ]);

    this.mesh = new Mesh({
      vertexData: vertices,
      normalData: normals,
      indexData: indices
    });
    this.mesh.setFlags(this.mesh.getFlags() | MeshFlags.DEFAULT);
    this.resLoadComplete();
  }

  private loadSkybox() {
    let paths: string[] = [];
    paths.push(
      "res/defaults/sky/left.png",
      "res/defaults/sky/right.png",
      "res/defaults/sky/down.png",
      "res/defaults/sky/up.png",
      "res/defaults/sky/front.png",
      "res/defaults/sky/back.png"
    );
    this.skybox = new Skybox(paths, TextureType.DEFAULT_MAP, () => {
      this.resLoadComplete();
    });
  }

  public loadResource() {
    this.loadTexture();
    this.loadMesh();
    this.loadSkybox();
  }

  public static getInstance(): RenderDefaults {
    return RenderDefaults.instance;
  }

  public getCheckerTexture(): Texture {
    return this.checkerTexture;
  }

  public getBlackTexture(): Texture {
    return this.blackMapTexture;
  }

  public getMesh(): Mesh {
    return this.mesh;
  }

  public getSkybox(): Skybox {
    return this.skybox;
  }

  public setLoadCompleteCallback(loadCompleteCallback: () => void) {
    this.loadCompleteCallback = loadCompleteCallback;
  }
}
