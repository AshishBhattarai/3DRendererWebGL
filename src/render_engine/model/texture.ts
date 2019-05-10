import { gl } from "../ogl_globals";

export enum TextureType {
  DIFFUSE_MAP = 0,
  SPECULAR_MAP,
  EMISSION_MAP,
  DEFAULT_MAP
}

export default class Texture {
  private id: WebGLTexture;
  private type: TextureType;

  constructor(image: HTMLImageElement, type: TextureType) {
    this.type = type;
    this.id = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  public getType(): TextureType {
    return this.type;
  }

  public bind(): void {
    gl.bindTexture(gl.TEXTURE_2D, this.id);
  }

  public unBind(): void {
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public setTextureWrap(wrap: GLenum) {
    this.bind();
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  }

  public release() {
    if (this.type == TextureType.DEFAULT_MAP) return;
    gl.deleteTexture(this.id);
    this.id = null;
  }
}
