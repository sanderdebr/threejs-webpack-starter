// Global imports -
import * as THREE from "three";
import Config from "../data/config";
// Local imports
// Components
import Renderer from "./components/renderer";
import Camera from "./components/camera";
import Light from "./components/light";
import Controls from "./components/controls";
import Raycaster from "./components/raycaster";

// Helpers
import Geometry from "./helpers/geometry";

// Model
import Texture from "./model/texture";
import Model from "./model/model";

// Managers
// import DatGUI from "./managers/datGUI";

// Data

export default class Main {
  constructor(container) {
    this.container = container;

    // Set loadingscreen
    this.loading = this.container.querySelector("#loading");

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

    // Raycaster
    this.raycaster = new Raycaster(
      this.scene,
      this.camera.threeCamera,
      this.renderer.threeRenderer
    );

    // Create and place lights in scene
    const lights = ["ambient", "directional", "point", "hemi"];
    lights.forEach(light => this.light.place(light));

    // Async loading of textures and models
    this.texture = new Texture();

    // Start loading the textures and then go on to load the model after the texture Promises have resolved
    this.texture.load().then(() => {
      this.manager = new THREE.LoadingManager();

      // Textures loaded, load models
      this.model = new Model(this.scene, this.manager, this.texture.textures);
      this.model.load();

      // Add plane
      this.geometry = new Geometry(this.scene);
      this.geometry.make("plane")(300, 300, 10, 10);
      this.geometry.place(
        null,
        this.texture.textures.Grass,
        "texture",
        [0, 0, 0],
        [Math.PI / 2, 0, 0]
      );

      // Add cube
      this.geometry.make("box")(10, 10, 10);
      this.geometry.place("blue", null, "standard", [100, 10, 0], [0, 0, 0]);

      // onProgress callback
      this.manager.onProgress = (item, loaded, total) => {
        console.log(`${item}: ${loaded} ${total}`);
      };

      // All loaders done now
      this.manager.onLoad = () => {
        // Everything is now fully loaded
        // Remove in production!
        setTimeout(() => {
          Config.isLoaded = true;
          this.loading.style.display = "none";
        }, 500);
      };
    });

    // Start render
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera.threeCamera);
    this.controls.threeControls.update();
    this.raycaster.render();

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
