import { Box, Button, Input, TextBox } from './index'
import { vec3 } from 'gl-matrix';
import SimLoop from '../sim_loop';
import SceneManager from '../scene_manager';

export class UI{
  public box1 : Box;
  public box2 : Box;
  public box3 : Box;
  public scenes: SceneManager;
  public camera : TextBox;
  constructor(){
    this.box1 = new Box("Options");
    this.box2 = new Box("Scenes");
    this.box3 = new Box('Informations');
    this.scenes = SceneManager.getInstance();
    
  }
  public render = () => {
    this.box1.push(new Input("Gravity", function(value) {}).render());
    this.box1.push(new Input("Force", function(value) {}).render());
    this.box1.push(new Input("Friction", function(value) {}).render());
    this.box1.push(new Input("Ball Mass", function(value) {}).render());

    this.scenes.getAllSceneNames().map(scene => {
      this.box2.push(new Button(scene.charAt(0).toUpperCase() + scene.slice(1), () => {
        this.scenes.setCurrentScene(scene);
      }).render());
    });
    
    this.box3.push(new TextBox(`Speed: 5.0 m/s`).render());
    this.box3.push(new TextBox(`Velocity:`).render());

    document.getElementsByTagName("body")[0].appendChild(
      this.box1.render({
        position: "absolute",
        right: "5px",
        left: "auto",
        top: "5px"
      })
    );
    document.getElementsByTagName("body")[0].appendChild(
      this.box2.render({
        position: "absolute",
        right: "auto",
        left: "5px",
        top: "5px"
      })
    );
    document.getElementsByTagName("body")[0].appendChild(
      this.box3.render({
        position: "absolute",
        right: "auto",
        left: "5px",
        top: "18%"
      })
    );
  }
  updateCamera = () => {
    
  }
}
export function render(){
    return new UI();  
}

export function renderUILoop(ui : UI){
}