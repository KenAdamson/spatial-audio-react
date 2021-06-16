import * as RES from 'resonance-audio';

function sceneInit() {
    // create the scene and context

    let audioContext = new AudioContext();
    let resonanceAudioScene = new RES.ResonanceAudio(audioContext);
    resonanceAudioScene.setAmbisonicOrder(2);

    resonanceAudioScene.output.connect(audioContext.destination);


    // add a room to the scene

    let emitterDistanceFromRearWall = -1.5;
    let roomDimensions = {
        height: 8,
        width: 12,
        depth: 20
    };

    let roomMaterials = {
        left: 'transparent',
        right: 'transparent',
        front: 'transparent',
        back: 'transparent',
        down: 'grass',
        up: 'acoustic-ceiling-tiles'
    };

    let emitterPosition = {
        x: 0,
        y: 1.5,
        z: 0//roomDimensions.depth / 2 + emitterDistanceFromRearWall
    };

    resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);
    resonanceAudioScene.setListenerPosition(0, 1.5, 0); //.6 * roomDimensions.depth - (roomDimensions.depth/2));
    resonanceAudioScene.setListenerOrientation(0, 0, 1, 0, 1, 0);
    // add audio input source

    // let audioElement = document.querySelector('#stream');
    // let audioStream = audioElement.captureStream();
    // console.log(audioStream.getAudioTracks());

    // let audioElementSource = audioContext.createMediaStreamSource(audioStream);
    let audioElement = document.createElement('audio');

    audioElement.src = '/audio/shakespeare_01-20/aspectsoflove_06_various_64kb-remaster.mp3';
    audioElement.hidden = false;

    let audioElementSource = audioContext.createMediaElementSource(audioElement);

    let source = resonanceAudioScene.createSource();
    source.setDirectivityPattern(0.5, 10);
    source.setGain(6);
    audioElementSource.connect(source.input);

    source.setPosition(emitterPosition.x, emitterPosition.y, emitterPosition.z);


    audioElement.play();
}

export {sceneInit};