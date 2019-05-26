import ModelParser from "./model_parser";
import sxml from "sxml";

export default class DaeParser extends ModelParser {
  constructor(daeData: string) {
    super();

    var xml = new sxml.XML(daeData);
  }
}
