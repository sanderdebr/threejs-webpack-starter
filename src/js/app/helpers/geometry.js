import * as THREE from "three";

import Material from "./material";

import Config from "../../data/config";

// This helper class can be used to create and then place geometry in the scene
export default class Geometry {
  constructor(scene) {
    this.scene = scene;
    this.geo = null;
  }

  make(type) {
    if (type === "plane") {
      return (width, height, widthSegments = 1, heightSegments = 1) => {
        this.geo = new THREE.PlaneGeometry(
          width,
          height,
          widthSegments,
          heightSegments
        );
      };
    }

    if (type === "box") {
      return (width = 10, height = 10, depth = 10) => {
        this.geo = new THREE.BoxBufferGeometry(width, height, depth);
      };
    }

    return null;
  }

  place(color = "red", texture, type = "standard", position, rotation) {
    const material = new Material(color, texture)[type];
    const mesh = new THREE.Mesh(this.geo, material);

    // Use ES6 spread to set position and rotation from passed in array
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);

    if (Config.shadow.enabled) {
      mesh.receiveShadow = true;
    }

    this.scene.add(mesh);
  }
}
