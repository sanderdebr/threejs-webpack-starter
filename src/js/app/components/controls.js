import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Config from "../../data/config";

// Controls based on orbit controls
export default class Controls {
  constructor(camera, container) {
    // Orbit controls first needs to pass in THREE to constructor
    this.threeControls = new OrbitControls(camera, container);
    this.init();
  }

  init() {
    this.threeControls.target.set(
      Config.controls.target.x,
      Config.controls.target.y,
      Config.controls.target.z
    );
  }
}
