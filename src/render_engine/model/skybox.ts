import Cubemap from "./cubemap";
import { TextureType } from "./texture";

export default class Skybox {
  private static readonly RPM = 2;

  private cubemap: Cubemap;
  public rpm: number;
  public fogEnable: boolean;
  private images: HTMLImageElement[] = [];

  private loadCompleteCallback: () => void;
  private textureType: TextureType;

  constructor(
    imagePath: string[],
    textureType: TextureType,
    loadCompleteCallback: () => void
  ) {
    this.loadCompleteCallback = loadCompleteCallback;
    this.textureType = textureType;
    this.loadNext(0, imagePath);
    this.rpm = Skybox.RPM;
    this.fogEnable = true;
  }

  /* TODO: Make a generic texture loader */
  private loadNext(index: number, imagePath: string[]) {
    var img = new Image();
    img.onload = () => {
      if (index < 6) {
        this.loadNext(index + 1, imagePath);
      }
      if (index == 5) {
        this.cubemap = new Cubemap(this.images, this.textureType);
        this.loadCompleteCallback();
        this.images.slice(0, this.images.length);
      }
    };
    img.src = imagePath[index];
    this.images.push(img);
  }

  public bindCubemap() {
    return this.cubemap.bind();
  }
}
