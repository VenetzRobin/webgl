import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const settings = {
    frames: 30
};

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
let controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AxesHelper(500))
camera.position.z = 1;
camera.position.y = 10;
camera.rotation.x = -20 * (Math.PI / 180);

var light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 1, 1 ).normalize();
scene.add(light);

let planeGeometry = new THREE.PlaneGeometry(50, 50, 200, 200);
let waterTexture = new THREE.TextureLoader().load('img/Water.jpg');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(4, 4);
//let waterNormalMap = new THREE.TextureLoader().load('img/WaterNormal.jpg');

let material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: waterTexture,
});
//material.normalMap = waterNormalMap;
let plane = new THREE.Mesh(planeGeometry, material);
plane.receiveShadow = true;
plane.castShadow = true;
plane.rotation.x = - Math.PI / 2;
plane.position.z = -30;
scene.add(plane);

document.body.appendChild(renderer.domElement);

const planeVertexCount = planeGeometry.attributes.position.count;

const frameInterval = 1000 / settings.frames;
function animate() {

    let now = Date.now() / 300;
    let waveDensity = .4;
    let waveHeight = 2;
    for(let i = 0; i < planeVertexCount; i++) {
        let x = planeGeometry.attributes.position.getX(i);
        let xsin = waveHeight * Math.sin(((x + now) * waveDensity));
        planeGeometry.attributes.position.setZ(i, xsin);
    }
    planeGeometry.computeVertexNormals();
    planeGeometry.attributes.position.needsUpdate = true;


    renderer.render(scene, camera);

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, frameInterval);
}

animate();