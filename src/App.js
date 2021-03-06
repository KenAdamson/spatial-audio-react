import './App.css';
import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as RES from 'resonance-audio';

class App extends Component {
    roomDimensions = {
        height: 3,
        width: 6.67,
        depth: 4
    };

    emitterDistanceFromRearWall = -3;
    fileURL = "/audio/remaster/aspectsoflove_02_various_64kb-remaster.mp3";
    ozymandias = "/audio/worldsbestpoetry/worldsbestpoetry7_2_027_various_64kb.mp3";
    canterbury = "/audio/worldsbestpoetry/worldsbestpoetry7_2_093_various_64kb.mp3";
    two_readers = "/audio/remaster/LR-two-readers-remaster.mp3";

    audio = new Audio();

    roomMaterials = {
        left: 'concrete-block-coarse',
        right: 'wood-panel',
        front: 'plaster-smooth',
        back: 'glass-thick',
        down: 'marble',
        up: 'acoustic-ceiling-tiles'
    };

    audioContext = null;

    componentDidMount() {

    }

    render() {
        return (
            <>
                <div id="overlay">
                    <button id="startButton" onClick={(event) => this.play()}>Play</button>
                    <br/>
                    <label htmlFor="xRange">X Position</label><br/>
                    <input type="range" min="1" max="100" step="1" className="slider" id="xRange"
                           onChange={(event) => this.xPositionChangedHandler(event)}/><br/>
                    <label htmlFor="xRange">Y Position</label><br/>
                    <input type="range" min="1" max="100" step="1" className="slider" id="yRange"
                           onChange={(event) => this.yPositionChangedHandler(event)}/><br/>
                    <label htmlFor="xRange">Z Position</label><br/>
                    <input type="range" min="1" max="100" step="1" className="slider" id="zRange"
                           onChange={(event) => this.zPositionChangedHandler(event)}/>
                </div>
                <div id="container"/>
                <div ref={ref => (this.mount = ref)}/>
            </>
        )
    }

    xPositionChangedHandler = (event) => {
    }

    yPositionChangedHandler = (event) => {
    }

    zPositionChangedHandler = (event) => {
    }

    updateSliders(roomDimensions) {
        let slider = document.querySelector("#xRange");
        slider.max = this.roomDimensions.x / 2 - 0.1;
        slider.min = slider.max * -1;

        slider = document.querySelector("#yRange");
        slider.max = this.roomDimensions.y / 2 - 0.1;
        slider.min = slider.max * -1;

        slider = document.querySelector("#zRange");
        slider.max = this.roomDimensions.z / 2 - 0.1;
        slider.min = slider.max * -1;
    }

    getAudioContext() {
        return new AudioContext();
    }

    getEmitterPositions = () => {
        let leftChannelPosition = {
            x: -2,
            y: 1.5,
            z: 1
        };

        let rightChannelPosition = {
            x: 2,
            y: 1.5,
            z: 1
        };

        return [ leftChannelPosition, rightChannelPosition ];
    };

    sceneInit = (event) => {
        this.audio.src = "http://streamingv2.shoutcast.com/ABC-Jazz?lang=en-US%2cen%3bq%3d0.9";
        this.audio.crossOrigin = "anonymous";
        this.audio.type = "audio/mpeg";
        this.audio.controls = true;
        this.audio.id = "stream";

        // create the scene and context
        let resonanceAudioScene = new RES.ResonanceAudio(this.audioContext);
        resonanceAudioScene.setAmbisonicOrder(3);
        resonanceAudioScene.output.connect(this.audioContext.destination);

        // add a room to the scene
        resonanceAudioScene.setRoomProperties(this.roomDimensions, this.roomMaterials);
        resonanceAudioScene.setListenerPosition(0, 0, -1);
        resonanceAudioScene.setListenerOrientation(0, 0, 1, 0, 1, 0);
        let audioSource = this.audioContext.createMediaElementSource(this.audio);


        // get left and right channels separately
        let splitter = this.audioContext.createChannelSplitter(2);
        audioSource.connect(splitter);

        let [ leftChannelPosition, rightChannelPosition ] = this.getEmitterPositions();

        console.log(leftChannelPosition);

        let leftChannelSource = resonanceAudioScene.createSource();
        leftChannelSource.setPosition(leftChannelPosition.x, leftChannelPosition.y, leftChannelPosition.z);
        leftChannelSource.setOrientation(0, 0, -1, 0, 1, 0);
        //leftChannelSource.setDirectivityPattern(0.5, 20);
        leftChannelSource.setGain(2);
        // // leftChannelSource.setSourceWidth(60);
        //
        let rightChannelSource = resonanceAudioScene.createSource();
        rightChannelSource.setPosition(rightChannelPosition.x, rightChannelPosition.y, rightChannelPosition.z);
        rightChannelSource.setOrientation(0, 0, -1, 0, 1, 0);
        rightChannelSource.setDirectivityPattern(0.5, 20);
        rightChannelSource.setGain(2);
        // rightChannelSource.setSourceWidth(60);
        //

        splitter.connect(leftChannelSource.input, 0);
        splitter.connect(rightChannelSource.input, 1);

    }

    play = () => {
        this.audioContext = this.getAudioContext();
        this.sceneInit();
        this.audio.play();
    };
}


const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
export default App;
