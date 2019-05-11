import { gl } from "../ogl_globals";
import { TextureType } from "./texture";

export default class Cubemap {
  private id: WebGLTexture;
  private type: TextureType;

  constructor(images: HTMLImageElement[], type = TextureType.DEFAULT_MAP) {
    this.id = gl.createTexture();
    this.type = type;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    for (let i = 0; i < 6; ++i) {
      let image = images[i];
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        gl.RGB,
        gl.RGB,
        gl.UNSIGNED_BYTE,
        image
      );
    }

    gl.texParameteri(
      gl.TEXTURE_CUBE_MAP,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }

  public bind(): void {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);
  }

  public unBind(): void {
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }

  public release() {
    if (this.type == TextureType.DEFAULT_MAP) return;
    gl.deleteTexture(this.id);
    this.id = null;
  }
}
