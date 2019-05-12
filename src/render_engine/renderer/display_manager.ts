import ogl_globals = require("../ogl_globals");

type onCanvasResize = (width: number, height: number) => void;
export default class DisplayManager {
  private static instance: DisplayManager = new DisplayManager();
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private viewport_size: number[];

  private lastFrameTime: number = 0;
  private lastFPSTime: number = 0;
  private delta: number = 0;
  private canvasResizeCallbacks: onCanvasResize[] = [];
  private isPointerCaptured = false;

  constructor() {
    if (DisplayManager.instance) {
      /* Throw error if user try to create DisplayManager with new */
      throw new Error(
        "Error: Instatiation failed: use DisplayManager.getInstance"
      );
    }
  }

  public updateTime(time: number) {
    this.delta = (time - this.lastFrameTime) / 1000.0;
    this.lastFrameTime = time;
  }

  /**
   * @param size: size[0] is width, size[1] is height;
   *
   * This creates opengl context so call this before calling any opengl functions
   */
  public createCanvas(size: number[]): void {
    let doc = <HTMLElement>document.getElementById("body");
    this.canvas = <HTMLCanvasElement>document.createElement("canvas");
    this.canvas.width = size[0];
    this.canvas.height = size[1];
    doc.appendChild(this.canvas);
    this.gl = <WebGL2RenderingContext>this.canvas.getContext("webgl2");
    ogl_globals.gl = this.gl;
    this.viewport_size = size;
    this.gl.viewport(0, 0, size[0], size[1]);

    window.onresize = () => {
      this.canvas.width = window.outerWidth;
      this.canvas.height = window.outerHeight;
      this.viewport_size = [this.canvas.width, this.canvas.height];
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.canvasResizeCallbacks.forEach(callback => {
        callback(this.canvas.width, this.canvas.height);
      });
    };

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement == this.canvas) {
        this.isPointerCaptured = true;
      } else {
        this.isPointerCaptured = false;
      }
    });
  }

  /**
   * @param size: size[0] is width, size[1] is height;
   */
  public setCanvasSize(size: number[]): void {
    this.canvas.width = size[0];
    this.canvas.height = size[1];
  }

  public setViewportSize(size: number[]): void {
    this.viewport_size = size;
    ogl_globals.gl.viewport(0, 0, size[0], size[1]);
  }

  public onCanvasResize(callback: onCanvasResize) {
    this.canvasResizeCallbacks.push(callback);
  }

  public getViewportSize(): number[] {
    return this.viewport_size;
  }

  public getCanvasSize(): number[] {
    return [this.canvas.width, this.canvas.height];
  }

  public getDelta(): number {
    return this.delta;
  }

  public getFrameTime(): number {
    return this.lastFrameTime;
  }

  public getGlContext(): WebGL2RenderingContext {
    return this.gl;
  }

  public pointerLock() {
    this.canvas.requestPointerLock();
  }

  public getisPointerCaptured(): boolean {
    return this.isPointerCaptured;
  }

  public static getInstance(): DisplayManager {
    return DisplayManager.instance;
  }
}
