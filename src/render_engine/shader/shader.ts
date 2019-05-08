import { gl } from "../ogl_globals";

export default class Shader {
  private program: WebGLProgram;

  constructor(vertexCode: string, fragmentCode: string) {
    var vertexShader = this.compileCode(vertexCode, gl.VERTEX_SHADER);
    var fragmentShader = this.compileCode(fragmentCode, gl.FRAGMENT_SHADER);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }

  private compileCode(shaderCode: string, type: number): WebGLShader {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, shaderCode);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var strType =
        type == gl.VERTEX_SHADER ? "Vertex Shader" : "Fragment Shader";
      console.log(gl.getShaderInfoLog(shader), strType);
    }
    return shader;
  }

  protected getUniformLocation(name: string): WebGLUniformLocation {
    var loc = gl.getUniformLocation(this.program, name);
    if (!loc) console.log("Invalid uniform name ", name);
    return loc;
  }

  public setUniformBlockBinding(name: string, bindingPoint: number): void {
    var index = gl.getUniformBlockIndex(this.program, name);
    if (index == gl.INVALID_INDEX) {
      console.log("Error: Invalid index for block " + name);
      return;
    }
    gl.uniformBlockBinding(this.program, index, bindingPoint);
  }

  public start(): void {
    gl.useProgram(this.program);
  }

  public stop(): void {
    gl.useProgram(null);
  }

  public delete(): void {
    gl.deleteProgram(this.program);
    this.program = null;
  }
}
