import { Box, Button, Input, TextBox } from './index'
import { vec3 } from 'gl-matrix';
import SimLoop from '../sim_loop';

export function renderUI(){
    let box1 = new Box("Options");
    box1.push(new Input("Gravity", function(value) {}).render());
    box1.push(new Input("Force", function(value) {}).render());
    box1.push(new Input("Friction", function(value) {}).render());
    box1.push(new Input("Ball Mass", function(value) {}).render());
    
    let box2 = new Box("Scenes");
    box2.push(new Button("Earth", function() {}).render());
    box2.push(new Button("Space", function() {
        let loader = new Box('Comming Soon');
        let info = document.createElement('h3');
        info.style.margin = '0';
        info.style.padding = '0';
        info.style.fontWeight = '200';
        info.innerHTML = 'This feature will be available in the near future!!';
        loader.push(info);
        document.getElementsByTagName("body")[0].appendChild(
            loader.render({
                top: "200px",
                left: "40%",
                width: '220px'
            })
        );
        setTimeout(() => {
            document
                .getElementsByTagName("body")[0]
                .removeChild(loader.render());
        }, 5000);
    }).render());
    let box3 = new Box('Informations');
    box3.push(new TextBox(`Speed: 5.0 m/s`).render());
    box3.push(new TextBox(`Velocity:`).render());
    box3.push(new TextBox(`Camera: `).render());
    document.getElementsByTagName("body")[0].appendChild(
      box1.render({
        position: "absolute",
        right: "5px",
        left: "auto",
        top: "5px"
      })
    );
    document.getElementsByTagName("body")[0].appendChild(
      box2.render({
        position: "absolute",
        right: "auto",
        left: "5px",
        top: "5px"
      })
    );
    document.getElementsByTagName("body")[0].appendChild(
      box3.render({
        position: "absolute",
        right: "auto",
        left: "5px",
        top: "18%"
      })
    );
}