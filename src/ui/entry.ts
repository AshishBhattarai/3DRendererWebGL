import { Box, Button, Input } from './index'

export function renderUI(){
    let box1 = new Box("Options");
    box1.push(new Input("Gravity", function(value) {}).render());
    box1.push(new Input("Force", function(value) {}).render());

    let box2 = new Box("Worlds");
    box2.push(new Button("Earth", function() {}).render());
    box2.push(new Button("Space", function() {}).render());
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
}