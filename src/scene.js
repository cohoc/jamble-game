import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


const scene = new THREE.Scene();
const clock = new THREE.Clock();
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});

renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    900
)
camera.position.set(-10, 15, -22);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
    })
)

const grid = new THREE.GridHelper(5,5);

plane.rotateX(-Math.PI / 2);
scene.add(plane);
scene.add(grid);

const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener("resize", windowResize);

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

function windowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();