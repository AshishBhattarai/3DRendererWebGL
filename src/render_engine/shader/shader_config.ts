export namespace ShaderConfig {
  export var VERTEX_LOC = 0;
  export var NORMAL_LOC = 1;
  export var UV_LOC = 4;
  export var GlobalVSBuffer = "GlobalVSData";
  export var GlobalFSBuffer = "GlobalFSData";
}

export enum MaterialShader {
  UNLIT_MATERIAL_COLOR_SHADER = 0,
  UNLIT_MATERIAL_TEXTURE_SHADER,
  LIT_MATERIAL_COLOR_SHADER,
  LIT_MATERIAL_TEXTURE_SHADER
}
