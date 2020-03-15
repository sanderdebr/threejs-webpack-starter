// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import PointerLockControls from "three-pointerlock";
import Config from "../../data/config";

// Controls based on orbit controls
export default class Controls {
  constructor(scene, camera, container) {
    this.container = container;
    this.threeControls = new PointerLockControls(camera, container);
    scene.add(this.threeControls.getObject());

    this.paused = document.createElement("div");
    this.paused.id = "paused";
    this.paused.innerHTML = Config.startupText;
    this.container.appendChild(this.paused);

    this.getPointerLock();
  }

  getPointerLock() {
    document.onclick = () => this.container.requestPointerLock();
    document.addEventListener(
      "pointerlockchange",
      () => {
        if (document.pointerLockElement) {
          this.paused.style.display = "none";
          this.threeControls.enabled = true;
          // Turn off the controls
        } else {
          // Display the pause screen
          this.paused.style.display = "";
          this.paused.innerHTML = Config.startupText;
          this.threeControls.enabled = false;
        }
      },
      false
    );
  }
}
