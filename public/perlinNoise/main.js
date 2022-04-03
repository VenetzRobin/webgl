import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

//seed noise
noise.seed(Math.random());

const settings = {
    frames: 30
};

const frameInterval = 1000 / settings.frames;

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000);
//let controls = new OrbitControls(camera, renderer.domElement);
//scene.add(new THREE.AxesHelper(500));
camera.position.z = 20;
camera.position.y = 10;
camera.rotation.x = - 20 * (Math.PI / 180);

let planeGemometry;
let wireFrame;

let vertexCount = 0;

function createGeometry() {
    planeGemometry = new THREE.PlaneBufferGeometry(100, 100, 20, 20);
    wireFrame = new THREE.WireframeGeometry(planeGemometry);
    vertexCount = wireFrame.attributes.position.count;
    let lineMaterial = new THREE.LineBasicMaterial({color: 0xffffff});
    let line = new THREE.LineSegments(wireFrame, lineMaterial);
    line.rotation.x = THREE.Math.degToRad(-80);
    scene.add(line);
}


function updateVertecies() {
    let now = Date.now() / 10000;
    for(let i = 0; i < vertexCount; i++) {
        let x = wireFrame.attributes.position.getX(i);
        let y = wireFrame.attributes.position.getY(i);
        let yNoise = noise.simplex2(x + now, y + now) * 3;
        wireFrame.attributes.position.setZ(i, yNoise);
    }

    wireFrame.attributes.position.needsUpdate = true;
}

function animate() {
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, frameInterval);
    updateVertecies();
    renderer.render(scene, camera);
}
createGeometry();
animate();