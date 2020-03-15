// Global imports -
import * as THREE from "three";

// Local imports
// Components
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Light from "./components/light";
import Controls from "./components/controls";

// Helpers
import Geometry from "./helpers/geometry";

// Managers
// import DatGUI from "./managers/datGUI";

// Data

export default class Main {
  constructor(container) {
    this.container = container;

    // Main scene creation
    this.scene = new THREE.Scene();

    // Main renderer constructor
    this.renderer = new Renderer(this.scene, container);

    // Components instantiations
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(
      this.scene,
      this.camera.threeCamera,
      container
    );
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ["ambient", "directional", "point", "hemi"];
    lights.forEach(light => this.light.place(light));

    // Create and place geo in scene
    this.geometry = new Geometry(this.scene);
    this.geometry.make("plane")(300, 300, 10, 10);
    this.geometry.place("red", [0, 0, 0], [Math.PI / 2, 0, 0]);

    // Add cube
    this.geometry.make("box")(10, 10, 10);
    this.geometry.place("blue", [0, 10, 0], [0, 0, 0]);

    // Later add async loading of textures and models

    // Start render
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera.threeCamera);
    this.controls.threeControls.update();

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
