import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import SceneInit from './lib/SceneInit';

// ============
// part 0
// set up Three.js scene with axis helper
// ============
const test = new SceneInit('myThreeJsCanvas');
test.initialize();
test.animate();
const axesHelper = new THREE.AxesHelper(8);
test.scene.add(axesHelper);

// ============
// part 1
// set up world physics with gravity
// ============
const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// create a ground body with a static plane
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  // infinte geometric plane
  shape: new CANNON.Plane(),
});
// rotate ground body by 90 degrees
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
// groundBody.quaternion.setFromEuler(-Math.PI / 2, Math.PI / 24, 0);
physicsWorld.addBody(groundBody);

// add a green wireframe to each object and visualize the physics world
const cannonDebugger = new CannonDebugger(test.scene, physicsWorld);

// const animate = () => {
//   physicsWorld.fixedStep();
//   cannonDebugger.update();
//   window.requestAnimationFrame(animate);
// };
// animate();

// ============
// part 2
// add base vehicle body
// reference: https://github.com/pmndrs/cannon-es/blob/master/examples/rigid_vehicle.html
// ============
const carBody = new CANNON.Body({
  mass: 20,
  position: new CANNON.Vec3(0, 6, 0),
  shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
});

const vehicle = new CANNON.RigidVehicle({
  chassisBody: carBody,
});

// vehicle.addToWorld(physicsWorld);

// const animate = () => {
//   physicsWorld.fixedStep();
//   cannonDebugger.update();
//   window.requestAnimationFrame(animate);
// };
// animate();

// ============
// part 2
// add wheels to the vehicle
// ============
const mass = 1;
const axisWidth = 5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3(-2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

vehicle.addToWorld(physicsWorld);

const wheels = [wheelBody1, wheelBody2, wheelBody3, wheelBody4];

// groundBody.quaternion.setFromEuler(-Math.PI / 2, Math.PI / 24, 0);

// const animate = () => {
//   physicsWorld.fixedStep();
//   cannonDebugger.update();
//   window.requestAnimationFrame(animate);
// };
// animate();

// ============
// part 3
// move car based on user input
// ============
document.addEventListener('keydown', (event) => {
  const maxSteerVal = Math.PI / 8;
  const maxForce = 100;

  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      vehicle.setWheelForce(maxForce, 0);
      vehicle.setWheelForce(maxForce, 1);
      break;

    case 's':
    case 'ArrowDown':
      vehicle.setWheelForce(-maxForce / 2, 0);
      vehicle.setWheelForce(-maxForce / 2, 1);
      break;

    case 'a':
    case 'ArrowLeft':
      vehicle.setSteeringValue(maxSteerVal, 0);
      vehicle.setSteeringValue(maxSteerVal, 1);
      break;

    case 'd':
    case 'ArrowRight':
      vehicle.setSteeringValue(-maxSteerVal, 0);
      vehicle.setSteeringValue(-maxSteerVal, 1);
      break;
  }
});

// reset car force to zero when key is released
document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
    case 'ArrowUp':
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case 's':
    case 'ArrowDown':
      vehicle.setWheelForce(0, 0);
      vehicle.setWheelForce(0, 1);
      break;

    case 'a':
    case 'ArrowLeft':
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;

    case 'd':
    case 'ArrowRight':
      vehicle.setSteeringValue(0, 0);
      vehicle.setSteeringValue(0, 1);
      break;
  }
});

// const animate = () => {
//   physicsWorld.fixedStep();
//   cannonDebugger.update();
//   window.requestAnimationFrame(animate);
// };
// animate();

// ============
// part 5
// sync game world with physics world
// ============
// const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10);
// const planeMaterial = new THREE.MeshStandardMaterial({
//   wireframe: true,
//   color: 0x00ff00,
// });
// const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// planeMesh.rotateX(-Math.PI / 2);
// test.scene.add(planeMesh);

const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshStandardMaterial({ wireframe: true });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
//test.scene.add(boxMesh);

const sphereGeometry1 = new THREE.SphereGeometry(1);
const sphereMaterial1 = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x00ff00 });
const sphereMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
//test.scene.add(sphereMesh1);

const sphereGeometry2 = new THREE.SphereGeometry(1);
const sphereMaterial2 = new THREE.MeshStandardMaterial({ wireframe: true, color: 0xff0000 });
const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
//test.scene.add(sphereMesh2);

const sphereGeometry3 = new THREE.SphereGeometry(1);
const sphereMaterial3 = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x0000ff });
const sphereMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
//test.scene.add(sphereMesh3);

const sphereGeometry4 = new THREE.SphereGeometry(1);
const sphereMaterial4 = new THREE.MeshStandardMaterial({ wireframe: true });
const sphereMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
//test.scene.add(sphereMesh4);

var car = undefined;
var wheel = undefined;

const loader = new GLTFLoader();
loader.load(
  // resource URL
  'models/ae86.glb',
  // called when the resource is loaded
  function(gltf) {
    car = gltf.scene;
    car.traverse((o) => {
      if(o.isMesh && o.name === "Object_8") {
        o.material.emissive = new THREE.Color(0xFFF63F)
      }
      if(o.name === "Circle003_13") {
        wheel = o;
      }
      /*if(o.isMesh && o.name === "Object_10") {
        o.material.emissive = new THREE.Color(0xFFF63F)
      }*/
    });
    test.scene.add(car);
    gltf.animations; // Array<THREE.AnimationClip>
    gltf.scene; // THREE.Group
    gltf.scenes; // Array<THREE.Group>
    gltf.cameras; // Array<THREE.Camera>
    gltf.asset; // Object
    animate();
  },
  // called while loading is progressing
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  // called when loading has errors
  function(error) {
    console.log(error);
  }
);


const animate = () => {
  physicsWorld.fixedStep();
  //cannonDebugger.update();
  boxMesh.position.copy(carBody.position);
  boxMesh.quaternion.copy(carBody.quaternion);
  sphereMesh1.position.copy(wheelBody1.position);
  sphereMesh1.quaternion.copy(wheelBody1.quaternion);
  sphereMesh2.position.copy(wheelBody2.position);
  sphereMesh2.quaternion.copy(wheelBody2.quaternion);
  sphereMesh3.position.copy(wheelBody3.position);
  sphereMesh3.quaternion.copy(wheelBody3.quaternion);
  sphereMesh4.position.copy(wheelBody4.position);
  sphereMesh4.quaternion.copy(wheelBody4.quaternion);
  //test.camera.position.copy(carBody.position);
  //test.camera.quaternion.copy(carBody.quaternion);
  wheel.rotation.y = sphereMesh2.rotation.y;
  car.position.copy(carBody.position);
  car.quaternion.copy(carBody.quaternion);
  test.camera.lookAt(new THREE.Vector3(car.position.x, car.position.y, car.position.z))
  test.render();
  window.requestAnimationFrame(animate);
};
