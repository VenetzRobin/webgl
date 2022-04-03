const starMoveSpeed = .5;
const numberOfStars = 6000;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 1;
camera.rotation.x = Math.PI / 2;

let starVertecies = [];
for(let i = 0; i < numberOfStars; i++) {
    let star = new THREE.Vector3(
        THREE.MathUtils.randFloat(-window.innerWidth, window.innerWidth ),
        THREE.MathUtils.randFloat(-window.innerHeight, window.innerHeight ),
        THREE.MathUtils.randFloat(-600, 600 )
    );

	starVertecies.push(star);
}

//let starSprite = new THREE.TextureLoader().load('http://localhost/starsBackground/star.png');
//let starSprite = new THREE.MeshBasicMaterial({color: 0xffffff});
//let starMaterial = new THREE.PointsMaterial({
//    color: 0xffffff,
//    size: 0.7,
//    map: starSprite
//});
//
//let stars = new THREE.Points(starGeometry, starMaterial);


let starGeometry = new THREE.BufferGeometry().setFromPoints(starVertecies);
//let material = new THREE.PointsMaterial({color: 0x888888});
//let stars = new THREE.Points(starGeometry, material);

let sprite = new THREE.TextureLoader().load('http://localhost:3000/starsBackground/star.png');
let starMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: .6,
    map: sprite
});
let stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function animate() {
    for(var i = 0; i < numberOfStars; i++) {
        let y = starGeometry.attributes.position.getY(i);
        y -= starMoveSpeed;
        if(y < -100) {
            y = 600;
        }
        starGeometry.attributes.position.setY(i, y);
    }

    starGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

document.body.addEventListener('mousemove', function(e) {
   camera.rotateY(e.movementX * Math.PI * .006 / 180);
   camera.rotateX(e.movementY * Math.PI * .006 / 180);
});

animate();