import './App.css';
import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as RES from 'resonance-audio';

class App extends Component {
    roomDimensions = {
        height: 2,
        width: 3,
        depth: 5
    };

    emitterDistanceFromRearWall = -3;
    fileURL = "/audio/remaster/aspectsoflove_02_various_64kb.mp3";
    audio = new Audio(this.fileURL);

    roomMaterials = {
        left: 'wood-panel',
        right: 'wood-panel',
        front: 'acoustic-ceiling-tiles',
        back: 'curtain-heavy',
        down: 'parquet-on-concrete',
        up: 'fiber-glass-insulation'
    };

    audioContext = null;

    componentDidMount() {
        this.sceneInit();
        this.audioContext = this.getAudioContext();
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
                <div id="container"></div>
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

    sceneInit = (event) => {
        // create the scene and context
        let resonanceAudioScene = this.constructAudioScene();

        // add a room to the scene
        this.addRoomToScene(resonanceAudioScene);

        let audioSource = this.audioContext.createMediaElementSource(this.audio);


        // get left and right channels separately
        let splitter =this.audioContext.createChannelSplitter(2);
        audioSource.connect(splitter);

        const {leftChannelPosition, rightChannelPosition} = this.getEmitterPositions();

        // let leftChannelSource = resonanceAudioScene.createSource();
        // leftChannelSource.setPosition(leftChannelPosition.x, leftChannelPosition.y, leftChannelPosition.z);
        // leftChannelSource.setOrientation(0, 0, -1, 0, 1, 0);
        // leftChannelSource.setDirectivityPattern(0.5, 10);
        // leftChannelSource.setGain(0);
        // leftChannelSource.setSourceWidth(60);
        //
        // let rightChannelSource = resonanceAudioScene.createSource();
        // rightChannelSource.setPosition(rightChannelPosition.x, rightChannelPosition.y, rightChannelPosition.z);
        // rightChannelSource.setOrientation(0, 0, -1, 0, 1, 0);
        // rightChannelSource.setDirectivityPattern(0.5, 10);
        // rightChannelSource.setGain(0);
        // rightChannelSource.setSourceWidth(60);
        //
        // splitter.connect(leftChannelSource.input, 0);
        // splitter.connect(rightChannelSource.input, 1);


        let merger = this.audioContext.createChannelMerger(2);
        splitter.connect(merger, 0, 0);
        splitter.connect(merger, 0, 1);
        merger.connect(this.audioContext.destination)
    }

    addRoomToScene = (resonanceAudioScene) => {
        this.roomDimensions = {height: 8, width: 12, depth: 20};

        this.updateSliders(this.roomDimensions);

        resonanceAudioScene.setRoomProperties(this.roomDimensions, this.roomMaterials);
        resonanceAudioScene.setListenerPosition(0, 1.5, -9.9); //.6 * roomDimensions.depth - (roomDimensions.depth/2));
        resonanceAudioScene.setListenerOrientation(0, 0, 1, 0, 1, 0);
    };

    constructAudioScene = () => {
        if(this.audioContext == null) {
            throw new Error('AudioContext has not been initialized yet!');
        }

        let resonanceAudioScene = new RES.ResonanceAudio(this.audioContext);
        resonanceAudioScene.setAmbisonicOrder(2);

        resonanceAudioScene.output.connect(this.audioContext.destination);
        return resonanceAudioScene;
    }

    play = () => {
        this.audio.play();
    };

    getEmitterPositions = () => {
        let leftChannelPosition = {
            x: -2,
            y: 1.5,
            z: this.roomDimensions.depth / 2 + this.emitterDistanceFromRearWall
        };

        let rightChannelPosition = {
            x: 2,
            y: 1.5,
            z: this.roomDimensions.depth / 2 + this.emitterDistanceFromRearWall
        };

        return [leftChannelPosition, rightChannelPosition];
    };
}


const rootElement = document.getElementById("root");
ReactDOM.render(<App/>, rootElement);
export default App;
