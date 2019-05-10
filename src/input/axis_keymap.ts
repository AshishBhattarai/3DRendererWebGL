export enum BoardKeys {
  KEY_W = 87,
  KEY_A = 65,
  KEY_S = 83,
  KEY_D = 68
}

export default class AxisKeyMap {
  private keyEventMap: Map<BoardKeys, boolean> = new Map();
  constructor() {
    this.initMap();

    window.onkeydown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          this.keyEventMap.set(BoardKeys.KEY_W, true);
          break;
        case "KeyA":
          this.keyEventMap.set(BoardKeys.KEY_A, true);
          break;
        case "KeyS":
          this.keyEventMap.set(BoardKeys.KEY_S, true);
          break;
        case "KeyD":
          this.keyEventMap.set(BoardKeys.KEY_D, true);
          break;
      }
    };

    window.onkeyup = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
          this.keyEventMap.set(BoardKeys.KEY_W, false);
          break;
        case "KeyA":
          this.keyEventMap.set(BoardKeys.KEY_A, false);
          break;
        case "KeyS":
          this.keyEventMap.set(BoardKeys.KEY_S, false);
          break;
        case "KeyD":
          this.keyEventMap.set(BoardKeys.KEY_D, false);
          break;
      }
    };
  }

  private initMap() {
    this.keyEventMap.set(BoardKeys.KEY_W, false);
    this.keyEventMap.set(BoardKeys.KEY_A, false);
    this.keyEventMap.set(BoardKeys.KEY_S, false);
    this.keyEventMap.set(BoardKeys.KEY_D, false);
  }

  public getKeyEventMap(): Map<BoardKeys, boolean> {
    return this.keyEventMap;
  }
}
