import Model from "../render_engine/model/model";
import ObjParser from "./obj_parser";
import DaeParser from "./dae_parser";
import AnimModel from "../render_engine/model/anim_model";

type ModelLoadedCallback = (
  mode: Model,
  name: String,
  loadCounter: number
) => void;
type ParserCallaback = (data: string) => void;

export default class Loader {
  private modelLoadedCallback: ModelLoadedCallback;
  private loadCounter = 0;

  constructor(modelLoadedCallback: ModelLoadedCallback) {
    this.modelLoadedCallback = modelLoadedCallback;
  }

  /**
   * @return - [string] - file name
   *					 [string] - file extension
   */
  private extractNameExt(path: String): [string, string] {
    let ret: [string, string] = ["", ""];
    let splitA = path.split(".");
    let splitB = splitA[0].split("/");
    ret[1] = splitA[splitA.length - 1];
    ret[0] = splitB[splitB.length - 1];
    return ret;
  }

  /**
   * @param:
   *     1) path -> path to the model file
   *     2) type  -> type of file, text, json, ... check xhr.responseType
   */
  private loadData(
    path: string,
    type: XMLHttpRequestResponseType,
    parserCallback: ParserCallaback
  ) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState == xhr.DONE) {
        if (xhr.status == 200 && xhr.response) {
          parserCallback(xhr.response);
        } else {
          console.log("Failed to load " + xhr.status + " " + xhr.statusText);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.responseType = type;
    xhr.send();
  }

  private parseObjModel(data: string, name: string) {
    --this.loadCounter;
    var obj = new ObjParser(data);
    var mesh = obj.getMeshes()[0];
    var model = new Model({ mesh: mesh, name: name });
    this.modelLoadedCallback(model, name, this.loadCounter);
  }

  private parseDaeModel(data: string, name: string) {
    --this.loadCounter;
    var dae = new DaeParser(data);
    var model: Model;
    if (dae.getHasAnimation()) {
      model = new AnimModel({
        mesh: dae.getMeshes()[0],
        name: name,
        boneCount: dae.getboneCount(),
        rootBone: dae.getRootBone()
      });
    } else {
      model = new Model({
        mesh: dae.getMeshes()[0],
        name: name
      });
    }
    this.modelLoadedCallback(model, name, this.loadCounter);
  }

  public loadModels(paths: string[]) {
    this.loadCounter = paths.length;
    for (let path of paths) {
      let nameExt = this.extractNameExt(path);
      switch (nameExt[1]) {
        case "obj":
          this.loadData(path, "text", data =>
            this.parseObjModel(data, nameExt[0])
          );
          break;
        case "dae":
          this.loadData(path, "text", data =>
            this.parseDaeModel(data, nameExt[0])
          );
        default:
          console.log("Unsupported model type ", nameExt[1]);
          break;
      }
    }
  }
}
