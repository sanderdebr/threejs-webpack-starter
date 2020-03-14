import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import PointerLockControls from "three-pointerlock";
import "../css/style.scss";

const UNITWIDTH = 90;
const UNITHEIGHT = 45;

let renderer;
let scene;
let camera;
let mapSize;
let controls;
// let controlsEnabled = false;
// Flags to determine which direction the player is moving
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Velocity vector for the player
const playerVelocity = new THREE.Vector3();

// How fast the player will move
const PLAYERSPEED = 800.0;

let clock;
let totalCubesWide; // How many cubes wide the maze will be
const collidableObjects = []; // An array of collidable objects used later
const canvas = document.createElement("canvas");

const DINOSCALE = 20;
const DINOSPEED = 4.0;
const dinoVelocity = new THREE.Vector3();

{
  const gltfLoader = new GLTFLoader();
  const url = "../models/brianhanson_aristosuchus.glb";
  gltfLoader.load(url, gltf => {
    const dinoObject = gltf.scene;
    dinoObject.scale.set(DINOSCALE, DINOSCALE, DINOSCALE);
    dinoObject.position.set(30, 0, -400);
    dinoObject.name = "dino";
    scene.add(dinoObject);

    // Store the dino
    const dino = scene.getObjectByName("dino");
  });
}

// HTML elements to be changed
const blocker = document.getElementById("blocker");

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// function radiansToDegrees(radians) {
//   return (radians * 180) / Math.PI;
// }

function createMazeCubes() {
  // Maze wall mapping, assuming even square
  // 1's are cubes, 0's are empty space
  const map = [
    [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0]
  ];

  // wall details
  const cubeGeo = new THREE.BoxGeometry(UNITWIDTH, UNITHEIGHT, UNITWIDTH);
  const cubeMat = new THREE.MeshPhongMaterial({
    color: 0x81cfe0
  });

  // Keep cubes within boundry walls
  const widthOffset = UNITWIDTH / 2;
  // Put the bottom of the cube at y = 0
  const heightOffset = UNITHEIGHT / 2;

  // See how wide the map is by seeing how long the first array is
  totalCubesWide = map[0].length;

  // Place walls where 1`s are
  for (let i = 0; i < totalCubesWide; i += 1) {
    for (let j = 0; j < map[i].length; j += 1) {
      // If a 1 is found, add a cube at the corresponding position
      if (map[i][j]) {
        // Make the cube
        const cube = new THREE.Mesh(cubeGeo, cubeMat);
        // Set the cube position
        cube.position.z = (i - totalCubesWide / 2) * UNITWIDTH + widthOffset;
        cube.position.y = heightOffset;
        cube.position.x = (j - totalCubesWide / 2) * UNITWIDTH + widthOffset;
        // Add the cube
        scene.add(cube);
        // Used later for collision detection
        collidableObjects.push(cube);
      }
    }
  }
  // The size of the maze will be how many cubes wide the array is * the width of a cube
  mapSize = totalCubesWide * UNITWIDTH;
}

function createGround() {
  // Create ground geometry and material
  const groundGeo = new THREE.PlaneGeometry(mapSize, mapSize);
  const groundMat = new THREE.MeshPhongMaterial({
    color: 0xa0522d,
    side: THREE.DoubleSide
  });

  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.set(0, 1, 0);
  // Rotate the place to ground level
  ground.rotation.x = degreesToRadians(90);
  scene.add(ground);
}

function createPerimWalls() {
  const halfMap = mapSize / 2; // Half the size of the map
  let sign = 1; // Used to make an amount positive or negative

  // Loop through twice, making two perimeter walls at a time
  for (let i = 0; i < 2; i += 1) {
    const perimGeo = new THREE.PlaneGeometry(mapSize, UNITHEIGHT);
    // Make the material double sided
    const perimMat = new THREE.MeshPhongMaterial({
      color: 0x464646,
      side: THREE.DoubleSide
    });
    // Make two walls
    const perimWallLR = new THREE.Mesh(perimGeo, perimMat);
    const perimWallFB = new THREE.Mesh(perimGeo, perimMat);

    // Create left/right wall
    perimWallLR.position.set(halfMap * sign, UNITHEIGHT / 2, 0);
    perimWallLR.rotation.y = degreesToRadians(90);
    scene.add(perimWallLR);
    // Used later for collision detection
    collidableObjects.push(perimWallLR);
    // Create front/back wall
    perimWallFB.position.set(0, UNITHEIGHT / 2, halfMap * sign);
    scene.add(perimWallFB);

    // Used later for collision detection
    collidableObjects.push(perimWallFB);

    sign = -1; // Swap to negative value
  }
}

function addLights() {
  const lightOne = new THREE.DirectionalLight(0xffffff);
  lightOne.position.set(1, 1, 1);
  scene.add(lightOne);

  // Add a second light with half the intensity
  const lightTwo = new THREE.DirectionalLight(0xffffff, 0.5);
  lightTwo.position.set(1, -1, -1);
  scene.add(lightTwo);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  renderer.render(scene, camera);
}

function animatePlayer(delta) {
  // Gradual slowdown
  playerVelocity.x -= playerVelocity.x * 10.0 * delta;
  playerVelocity.z -= playerVelocity.z * 10.0 * delta;

  if (moveForward) {
    playerVelocity.z -= PLAYERSPEED * delta;
  }
  if (moveBackward) {
    playerVelocity.z += PLAYERSPEED * delta;
  }
  if (moveLeft) {
    playerVelocity.x -= PLAYERSPEED * delta;
  }
  if (moveRight) {
    playerVelocity.x += PLAYERSPEED * delta;
  }
  if (!(moveForward || moveBackward || moveLeft || moveRight)) {
    // No movement key being pressed. Stop movememnt
    playerVelocity.x = 0;
    playerVelocity.z = 0;
  }
  controls.getObject().translateX(playerVelocity.x * delta);
  controls.getObject().translateZ(playerVelocity.z * delta);
}

function animateDino(delta, dino) {
  const myDino = dino;
  // Gradual slowdown
  dinoVelocity.x -= dinoVelocity.x * 10.0 * delta;
  dinoVelocity.z -= dinoVelocity.z * 10.0 * delta;

  dinoVelocity.z += DINOSPEED * delta;
  // Move the dino
  myDino.translateZ(dinoVelocity.z * delta);
}

function animate() {
  render();
  requestAnimationFrame(animate);
  // Get the change in time between frames
  const delta = clock.getDelta();
  animatePlayer(delta);
  animateDino();
}

function lockChange(dino) {
  // Turn on controls
  if (document.pointerLockElement === canvas) {
    // Hide blocker and instructions
    blocker.style.display = "none";
    controls.enabled = true;
    // Turn off the controls
  } else {
    // Display the blocker and instruction
    blocker.style.display = "";
    controls.enabled = false;
  }
}

function getPointerLock() {
  document.onclick = function() {
    canvas.requestPointerLock();
  };
  document.addEventListener("pointerlockchange", lockChange, false);
}

function listenForPlayerMovement() {
  // A key has been pressed
  const onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;

      case 37: // left
      case 65: // a
        moveLeft = true;
        break;

      case 40: // down
      case 83: // s
        moveBackward = true;
        break;

      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      default:
        return null;
    }
    return null;
  };

  // A key has been released
  const onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;

      case 37: // left
      case 65: // a
        moveLeft = false;
        break;

      case 40: // down
      case 83: // s
        moveBackward = false;
        break;

      case 39: // right
      case 68: // d
        moveRight = false;
        break;
      default:
        return null;
    }
    return null;
  };

  // Add event listeners for when movement keys are pressed and released
  document.addEventListener("keydown", onKeyDown, false);
  document.addEventListener("keyup", onKeyUp, false);
}

function init() {
  clock = new THREE.Clock();
  listenForPlayerMovement();
  // Create the scene
  scene = new THREE.Scene();

  // Add some fog
  scene.fog = new THREE.FogExp2(0xcccccc, 0.0015);

  // Create canvas and attach to DOM
  document.body.appendChild(canvas);

  // Render settings
  renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setClearColor(scene.fog.color);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera settings
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.y = 20;
  camera.position.x = 0;
  camera.position.z = 0;
  scene.add(camera);

  // Add walls of maze
  createMazeCubes();
  createGround();
  createPerimWalls();

  // Add lights
  addLights();

  // Listen to resizes
  window.addEventListener("resize", onWindowResize, false);

  // Add controls
  controls = new PointerLockControls(camera);
  scene.add(controls.getObject());
}

getPointerLock();
init();
animate();
