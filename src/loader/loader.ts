import Model from "../render_engine/model/model";
import ObjParser from "./obj_parser";

type ModelLoadedCallback = (mode: Model, name: String) => void;
type ParserCallaback = (data: any) => void;

export default class Loader {
  private modelCallback: ModelLoadedCallback;

  constructor(modelCallback: ModelLoadedCallback) {
    this.modelCallback = modelCallback;
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
    var obj = new ObjParser(data);
    var mesh = obj.getMeshes()[0];
    var model = new Model({ mesh: mesh });
    this.modelCallback(model, name);
  }

  public loadModel(path: string): string {
    let nameExt = this.extractNameExt(path);
    switch (nameExt[1]) {
      case "obj":
        this.loadData(path, "text", data =>
          this.parseObjModel(data, nameExt[0])
        );
        break;
      default:
        console.log("Unsupported model type ", nameExt[1]);
        break;
    }
    return nameExt[0];
  }
}
