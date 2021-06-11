import * as THREE from 'three';
import {PositionalAudioHelper} from "three/examples/jsm/helpers/PositionalAudioHelper";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import {FlakesTexture} from "three/examples/jsm/textures/FlakesTexture";

function createScene() {
    // create scene
    let theScene = new THREE.Scene();
    theScene.background = new THREE.Color(0xa0a0a0);
    theScene.fog = new THREE.Fog(0xa0a0a0, 2, 20);
    return theScene;
}

function initLighting(theScene) {
    // add lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(4, 20, 4);
    theScene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(5, 5, 0);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 1;
    dirLight.shadow.camera.bottom = -1;
    dirLight.shadow.camera.left = -1;
    dirLight.shadow.camera.right = 1;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 20;
    theScene.add(dirLight);
}

function createCamera() {
    // create camera
    let perspectiveCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    perspectiveCamera.position.set(0, 1, 3);

    return perspectiveCamera;
}

function initEnvironment(theScene) {
    // Environment setup
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    theScene.add(mesh);

    const grid = new THREE.GridHelper(50, 50, 0x888888, 0x888888);
    theScene.add(grid);
}

function setupVideo(audio) {
    const video = document.getElementById("video");
    const option = {
        video: {width: {min:640}, height: {min:480}},
        audio: true
    };

    // get image from camera
    navigator.getUserMedia(option, (stream) => {
        video.srcObject = stream;

        audio.setMediaStreamSource(stream);

        video.play();
        video.muted = true;
        video.addEventListener("loadeddata", () => {
            // ready
        });
    }, (error) => {
        console.log(error);
    });

    return video;
}

 function setupAudioBooks(scene, listener) {
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.SphereGeometry(80, 32, 16);
    geometry.scale(1/180, 1/180, 1/180);

    const normalMap3 = new THREE.CanvasTexture(new FlakesTexture());
    normalMap3.wrapS = THREE.RepeatWrapping;
    normalMap3.wrapT = THREE.RepeatWrapping;
    normalMap3.repeat.x = 10;
    normalMap3.repeat.y = 6;
    normalMap3.anisotropy = 16;

    const streamElement = document.getElementById('stream');
    streamElement.play();

    const streamPlayer = new THREE.PositionalAudio(listener);
    streamPlayer.hasPlaybackControl = true;
    streamPlayer.setMediaElementSource(streamElement);
    streamPlayer.setRefDistance(1);
    streamPlayer.setDirectionalCone(45,60,0.1);

    const streamHelper = new PositionalAudioHelper(streamPlayer, 5);
    streamPlayer.add(streamHelper);

    // car paint, metal flake, blue
    let material = new THREE.MeshPhysicalMaterial( {
     clearcoat: 1.0,
     clearcoatRoughness: 0.1,
     metalness: 0.9,
     roughness: 0.5,
     color: 0x0000ff,
     normalMap: normalMap3,
     normalScale: new THREE.Vector2( 0.15, 0.15 )
    } );

    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(-1, 2.5, 0);
    mesh.add(streamPlayer);
    group.add( mesh );

    const nietzscheElement = document.getElementById("nietzsche");
    nietzscheElement.play();

    const nietzschePlayer = new THREE.PositionalAudio(listener);
    nietzschePlayer.hasPlaybackControl = true;
    nietzschePlayer.setMediaElementSource(nietzscheElement);
    nietzschePlayer.setRefDistance(1);
    nietzschePlayer.setDirectionalCone(45,60,0.1);

    const nietzscheHelper = new PositionalAudioHelper(nietzschePlayer, 5);
    nietzschePlayer.add(nietzscheHelper);

     // car paint, metal flake, green
     material = new THREE.MeshPhysicalMaterial( {
         clearcoat: 1.0,
         clearcoatRoughness: 0.1,
         metalness: 0.9,
         roughness: 0.5,
         color: 0x00ff00,
         normalMap: normalMap3,
         normalScale: new THREE.Vector2( 0.15, 0.15 )
     } );

     mesh = new THREE.Mesh( geometry, material );
     mesh.position.set(1, 0.5, 0);
     mesh.add(nietzschePlayer);
     group.add( mesh );

    const shakespeareElement = document.getElementById("shakespeare");
    shakespeareElement.play();
    const shakespearePlayer = new THREE.PositionalAudio(listener);
    shakespearePlayer.hasPlaybackControl = true;
    shakespearePlayer.setMediaElementSource(shakespeareElement);
    shakespearePlayer.setRefDistance(1);
    shakespearePlayer.setDirectionalCone(45, 60, 0.1);

    const shakespeareHelper = new PositionalAudioHelper(shakespearePlayer, 5);
    shakespearePlayer.add(shakespeareHelper);

     // car paint, metal flake, red
    material = new THREE.MeshPhysicalMaterial( {
     clearcoat: 1.0,
     clearcoatRoughness: 0.1,
     metalness: 0.9,
     roughness: 0.5,
     color: 0xff0000,
     normalMap: normalMap3,
     normalScale: new THREE.Vector2( 0.15, 0.15 )
    } );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(1, 2.5, 0);
    mesh.add(shakespearePlayer);
    group.add( mesh );
 }

function sceneInit() {
    const overlay = document.getElementById('overlay');
    overlay.remove();

    const container = document.getElementById('container');

    let camera = createCamera();

    const scene = createScene();

    const cameraHelper = new THREE.CameraHelper( camera );
    scene.add( cameraHelper );

    initLighting(scene);

    initEnvironment(scene);

    // Audio Setup
    // Listener - attach to camera
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // const audioElement = document.getElementById('stream');
    // audioElement.play();

    // Positional Audio source
    const sound = new THREE.PositionalAudio(listener);
    //sound.hasPlaybackControl = true;

    //sound.setMediaElementSource(audioElement);
    sound.setRefDistance(1);
    sound.setDirectionalCone(45, 60, 0.1);

    const helper = new PositionalAudioHelper(sound, 5);
    sound.add(helper);

    const video = setupVideo(sound);

    const videoTexture = new THREE.VideoTexture(video);
    const videoDisplayGeometry = new THREE.PlaneGeometry(4,3);
    videoDisplayGeometry.scale(0.25, 0.25, 0.25);
    const videoDisplayMaterial = new THREE.MeshBasicMaterial({map: videoTexture});
    const videoDisplayMesh = new THREE.Mesh(videoDisplayGeometry, videoDisplayMaterial);
    //videoDisplayMesh.lookAt(camera.position);
    videoDisplayMesh.position.set(-1, 0.5, 0);
    scene.add(videoDisplayMesh);

    setupAudioBooks(scene, listener);

    let renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.update();
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.maxPolarAngle = 0.5 * Math.PI;

    videoDisplayMesh.add(sound);

    // const wallGeometry = new THREE.BoxGeometry(2, 1, 0.1);
    // const wallMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    //
    // const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    // wall.position.set(0, 0.5, -2.0);
    // scene.add(wall);

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    };

    window.addEventListener('resize', onWindowResize);

    const render = () => {
        renderer.render(scene, camera);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        render();
    };

    animate();
}

export {sceneInit};