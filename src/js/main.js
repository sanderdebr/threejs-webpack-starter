import * as THREE from "three";
import PointerLockControls from "three-pointerlock";
import dat from "dat.gui";
import "../css/style.scss";

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }

  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }

  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

const application = () => {
  let camera;
  let renderer;
  let scene;
  let material;
  let cubeMesh;
  let planeMesh;
  let controls;

  const constants = {
    app: document.getElementById("app"),
    canvas: document.getElementById("canvas")
  };

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

  function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");

    createCamera();
    createLights();
    createMeshes();
    createRenderer();
    addControls();

    constants.app.appendChild(constants.canvas);
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

/* const blue = new THREE.Color("skyblue");*

function init() {sd
  // Create canvas
  const app = document.getElementById("app");
  const canvas = document.createElement("canvas");

  // Create scene and camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Add floor
  const floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);

  // Add cube
  const boxGeometry = new THREE.BoxBufferGeometry(20, 20, 20);
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100
  });
  // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.x = -60;
  box.position.y = 50;
  box.position.z = 0;
  scene.add(box);

  // Add renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setSize(window.innerWidth, window.innerHeight);

  function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  // Resize listener
  window.addEventListener("resize", onWindowResize, false);

  // Only show canvas when loaded
  app.appendChild(canvas);

  // Render loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update(1);
    renderer.render(scene, camera);
  }
  animate();
} */
