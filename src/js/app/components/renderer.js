import * as THREE from "three";

// Main webGL renderer class
export default class Renderer {
  constructor(scene, container) {
    // Properties
    this.scene = scene;
    this.container = container;

    // Create WebGL renderer and set its antialias
    this.threeRenderer = new THREE.WebGLRenderer({ antialias: true });

    // Appends canvas
    container.appendChild(this.threeRenderer.domElement);

    // Shadow map options
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Initial size update set to canvas container
    this.updateSize();

    // Listeners
    document.addEventListener(
      "DOMContentLoaded",
      () => this.updateSize(),
      false
    );
    window.addEventListener("resize", () => this.updateSize(), false);
  }

  updateSize() {
    this.threeRenderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
  }

  render(scene, camera) {
    // Renders scene to canvas target
    this.threeRenderer.render(scene, camera);
  }
}
