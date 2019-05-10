import Texture, { TextureType } from "./model/texture";
import Mesh, { ModelType } from "./model/mesh";

// Default textures / models for renderer

export default class RenderDefaults {
  private static readonly NUM_RES = 3;
  private static instance = new RenderDefaults();
  private checkerTexture: Texture;
  private blackMapTexture: Texture;
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
      // Front face
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,

      // Back face
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,

      // Top face
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,

      // Bottom face
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      -1.0,
      -1.0,
      1.0,

      // Right face
      1.0,
      -1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      1.0,
      1.0,
      -1.0,
      1.0,

      // Left face
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      -1.0,
      1.0,
      -1.0,
      1.0,
      1.0,
      -1.0,
      1.0,
      -1.0
    ]);

    var indices = new Uint32Array([
      0,
      1,
      2,
      0,
      2,
      3,
      4,
      5,
      6,
      4,
      6,
      7,
      8,
      9,
      10,
      8,
      10,
      11,
      12,
      13,
      14,
      12,
      14,
      15,
      16,
      17,
      18,
      16,
      18,
      19,
      20,
      21,
      22,
      20,
      22,
      23
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

    this.mesh = new Mesh(
      {
        vertexData: vertices,
        normalData: normals,
        indexData: indices
      },
      ModelType.DEFAULT
    );
    this.resLoadComplete();
  }

  public loadResource() {
    this.loadTexture();
    this.loadMesh();
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

  public setLoadCompleteCallback(loadCompleteCallback: () => void) {
    this.loadCompleteCallback = loadCompleteCallback;
  }
}
