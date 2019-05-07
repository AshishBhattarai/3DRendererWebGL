import ModelParser from "./model_parser";
import Mesh from "../render_engine/model/mesh";

export default class ObjParser extends ModelParser {
  private nVertices: number[];
  private nNormals: number[];
  private nIndices: number[];
  private nTexCoords: number[];

  private pNormals: number[];
  private pTexCoords: number[];

  constructor(objData: string) {
    super();
    this.nVertices = [];
    this.nNormals = [];
    this.nIndices = [];
    this.nTexCoords = [];

    this.pNormals = [];
    this.pTexCoords = [];

    var vertices: Float32Array;
    var normals: Float32Array;
    var texCoords: Float32Array;
    var indices: Uint32Array;

    var lines = objData.split("\n");
    for (var line of lines) {
      this.parseLine(line);
    }

    if (this.nVertices) {
      var mesh: Mesh = null;
      vertices = new Float32Array(this.nVertices);
      indices = new Uint32Array(this.nIndices);
      this.parseSuccess = true;
      if (this.pNormals) {
        this.hasNormals = true;
        normals = new Float32Array(this.pNormals);
      }
      if (this.pTexCoords) {
        this.hasTexCoords = true;
        texCoords = new Float32Array(this.pTexCoords);

        mesh = new Mesh({
          vertexData: vertices,
          normalData: normals,
          indexData: indices,
          uvData: texCoords
        });
      } else {
        mesh = new Mesh({
          vertexData: vertices,
          normalData: normals,
          indexData: indices
        });
      }
      this.meshes.push(mesh);
    }
  }

  private parseLine(line: string) {
    let split = line.split(" ");
    switch (split[0]) {
      case "v":
        this.nVertices.push(+split[1], +split[2], +split[3]);
        break;
      case "vt":
        this.nTexCoords.push(+split[1], +split[2]);
        break;
      case "vn":
        this.nNormals.push(+split[1], +split[2], +split[3]);
        break;
      case "f":
        this.processFaces(split[1]);
        this.processFaces(split[2]);
        this.processFaces(split[3]);
        break;
    }
  }

  private orderTextureCoords(iV: number, iT: number) {
    this.pTexCoords[iV] = this.nTexCoords[iT];
    this.pTexCoords[iV + 1] = this.nTexCoords[iT + 1];
  }

  private orderNormal(iV: number, iN: number) {
    this.pNormals[iV] = this.nNormals[iN];
    this.pNormals[iV + 1] = this.nNormals[iN + 1];
    this.pNormals[iV + 2] = this.nNormals[iN + 2];
  }

  private processFaces(faceLine: string) {
    let hasVt = faceLine.search("//");
    var faceVerts: string[];
    if (hasVt == -1) {
      faceVerts = faceLine.split("/");
    } else {
      faceVerts = faceLine.split("//");
    }
    let iV = (+faceVerts[0] - 1) * 3;
    if (faceVerts.length == 3) {
      // with texture coords
      let iT = (+faceVerts[1] - 1) * 2;
      let iN = (+faceVerts[2] - 1) * 3;
      this.orderTextureCoords(iV, iT);
      this.orderNormal(iV, iN);
    } else if (faceVerts.length == 2) {
      // without texture coords
      let iN = (+faceVerts[1] - 1) * 3;
      this.orderNormal(iV, iN);
    }
    this.nIndices.push(iV / 3);
  }
}
