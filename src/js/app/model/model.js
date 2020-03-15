import * as THREE from "three";

import Material from "../helpers/material";
import Helpers from "../../utils/helpers";
import Config from "../../data/config";

// Loads in a single object from the config file
export default class Model {
  constructor(scene, manager, textures) {
    this.scene = scene;
    this.textures = textures;

    // Manager is passed in to loader to determine when loading done in main
    this.loader = new THREE.ObjectLoader(manager);
    this.obj = null;
  }

  load() {
    // Load model with ObjectLoader
    this.loader.load(
      Config.model.path,
      obj => {
        obj.traverse(child => {
          if (child instanceof THREE.Mesh) {
            // Create material for mesh and set its map to texture by name from preloaded textures
            const myChild = child;
            const material = new Material(0xffffff).standard;
            material.map = this.textures.UV;
            myChild.material = material;

            // Set to cast and receive shadow if enabled
            if (Config.shadow.enabled) {
              myChild.receiveShadow = true;
              myChild.castShadow = true;
            }
          }
        });

        // Set prop to obj so it can be accessed from outside the class
        this.obj = obj;

        obj.scale.multiplyScalar(Config.model.scale);
        this.scene.add(obj);
      },
      Helpers.logProgress(),
      Helpers.logError()
    );
  }
}
