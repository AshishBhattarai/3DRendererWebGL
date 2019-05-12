import { Box, Button, Input } from "./index";
import Main from "../main";
import PhysicsWorld from "../physics/physics_world";
import { Vec3 } from "cannon";
export function renderUI() {
  let box1 = new Box("Options");
  box1.push(
    new Input("Gravity", function(value: number) {
      PhysicsWorld.getInstance().world.gravity = new Vec3(0, -value, 0);
    }).render()
  );
  box1.push(new Input("Force", function(value: number) {}).render());
  box1.push(new Input("Mass", function(value: number) {}).render());

  let box2 = new Box("Scene");
  box2.push(new Button("Earth", function() {}).render());
  box2.push(
    new Button("Space", function() {
      let loader = new Box("Comming Soon");
      let info = document.createElement("h3");
      info.style.margin = "0";
      info.style.padding = "0";
      info.style.fontWeight = "200";
      info.innerHTML = "This feature will be available in the near future!!";
      loader.push(info);
      document.getElementsByTagName("body")[0].appendChild(
        loader.render({
          top: "200px",
          left: "40%",
          width: "220px"
        })
      );
      setTimeout(() => {
        document.getElementsByTagName("body")[0].removeChild(loader.render());
      }, 5000);
    }).render()
  );
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
