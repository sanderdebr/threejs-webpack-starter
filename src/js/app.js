import Main from "./app/main";

// Styles
import "../css/style.scss";

function init() {
  const container = document.getElementById("container");
  return new Main(container);
}

init();
/*
import * as THREE from "three";
import PointerLockControls from "three-pointerlock";
import dat from "dat.gui";
import ColorGUIHelper from "./utils";

const application = () => {
  let camera;
  let renderer;
  let scene;
  let material;
  let cubeMesh;
  let planeMesh;
  let controls;
  let constants;

  function setupDOM() {
    const app = document.createElement("div");
    app.id = "app";
    const paused = document.createElement("div");
    paused.innerText = "Loading...";
    paused.id = "paused";
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    document.body.appendChild(app);
    document.body.appendChild(paused);
    document.body.appendChild(canvas);

    constants = {
      app: document.getElementById("app"),
      paused: document.getElementById("paused"),
      canvas: document.getElementById("canvas"),
      startupText:
        "Click to start playing... <br/>Use W,A,S,D keys and spacebar to walk around."
    };
  }

  function createCamera() {
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 5;
  }

  function createLights() {
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
  }

  function createMaterials() {
    const cube = new THREE.MeshStandardMaterial({
      color: 0xff3333,
      flatShading: true
    });
    cube.color.convertSRGBToLinear();
    const plane = new THREE.MeshBasicMaterial({ vertexColors: true });
    material = {
      cube,
      plane
    };
    return material;
  }

  function createGeometries() {
    const cube = new THREE.BoxBufferGeometry(20, 20, 20);
    const plane = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
    plane.rotateX(-Math.PI / 2);
    return {
      cube,
      plane
    };
  }

  function createMeshes() {
    const materials = createMaterials();
    const geometries = createGeometries();
    cubeMesh = new THREE.Mesh(geometries.cube, materials.cube);
    planeMesh = new THREE.Mesh(geometries.plane, materials.plane);
    const group = new THREE.Group();
    group.add(cubeMesh);
    group.add(planeMesh);

    // Add mesh to scene
    scene.add(group);
  }

  function addControls() {
    controls = new PointerLockControls(camera);
    controls.enabled = true;
    scene.add(controls.getObject());
  }

  function createRenderer() {
    renderer = new THREE.WebGLRenderer({
      canvas: constants.canvas,
      antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
  }

  // Switch the controls on or off
  function lockChange() {
    // Turn on controls
    if (document.pointerLockElement === constants.app) {
      constants.paused.style.display = "none";
      controls.enabled = true;
      // Turn off the controls
    } else {
      // Display the pause screen
      constants.paused.style.display = "";
      controls.enabled = false;
    }
  }

  // Request lock change
  function getPointerLock() {
    document.onclick = () => constants.app.requestPointerLock();
    document.addEventListener("pointerlockchange", lockChange, false);
  }

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");

    setupDOM();
    createCamera();
    createLights();
    createMeshes();
    createRenderer();
    getPointerLock();
    addControls();

    constants.app.appendChild(constants.canvas);
    constants.paused.innerHTML = constants.startupText;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function update() {
    // Animation logic here
  }

  function onWindowResize() {
    constants.canvas.width = window.innerWidth;
    constants.canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  window.addEventListener("resize", onWindowResize);

  function animationLoop() {
    update();
    render();
    controls.update();
  }

  init();

  controls.update();
  renderer.setAnimationLoop(animationLoop);

  const gui = new dat.GUI({ autoPlace: true });
  const folder = gui.addFolder(`Cube`);

  folder
    .addColor(new ColorGUIHelper(material.cube, "color"), "value") //
    .name("color")
    .onChange(animationLoop);

  folder
    .add(cubeMesh.scale, "x", 0.1, 1.5) //
    .name("scale x")
    .onChange(animationLoop);
};

application();
*/
