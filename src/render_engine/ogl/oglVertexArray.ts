import { gl } from "./oglGlobals";
import OGLBuffer from "./oglBuffer";

export enum DrawMode {
  POINTS = WebGL2RenderingContext.POINTS,
  LINES = WebGL2RenderingContext.LINES,
  LINES_STRIP = WebGL2RenderingContext.LINE_STRIP,
  TRIANGLES = WebGL2RenderingContext.TRIANGLES,
  TRIANGLE_STRIP = WebGL2RenderingContext.TRIANGLE_STRIP
}

export default class OGLVertexArray {
  private id: WebGLVertexArrayObject;
  private indexVbo: OGLBuffer;
  private indexCount: number = 0;
  private vbos: OGLBuffer[] = [];
  private attributes: number[] = [];

  constructor() {
    this.id = gl.createVertexArray();
  }

  public createIndex(data: Uint32Array) {
    this.indexVbo = new OGLBuffer(gl.ELEMENT_ARRAY_BUFFER);
    this.indexVbo.bind();
    this.indexVbo.bufferData(data);
    this.indexCount = data.length;
  }

  public unBindIndex() {
    this.indexVbo.unBind();
  }

  public createAttribute(
    attribute: number,
    compSize: number,
    data: Float32Array | Uint32Array
  ) {
    var vbo = new OGLBuffer();
    var dataType: GLenum = (data as Float32Array) ? gl.FLOAT : gl.INT;
    vbo.bind();
    vbo.bufferData(data);
    gl.vertexAttribPointer(attribute, compSize, dataType, false, 0, 0);
    this.attributes.push(attribute);
    this.vbos.push(vbo);
  }

  public bind() {
    gl.bindVertexArray(this.id);
  }

  public draw(drawMode = DrawMode.TRIANGLES) {
    gl.drawElements(drawMode, this.indexCount, gl.UNSIGNED_INT, 0);
  }

  public unBind() {
    gl.bindVertexArray(null);
  }

  public enableAttribs() {
    this.attributes.forEach(attrib => {
      gl.enableVertexAttribArray(attrib);
    });
  }

  public disableAttribs() {
    this.attributes.forEach(attrib => {
      gl.disableVertexAttribArray(attrib);
    });
  }

  public getIndexCount(): number {
    return this.indexCount;
  }

  public release() {
    gl.deleteVertexArray(this.id);
    this.vbos.forEach(vbo => {
      vbo.release();
    });
    this.indexVbo.release();
  }
}
