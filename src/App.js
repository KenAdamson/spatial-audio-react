import './App.css';
import React, { Component } from "react";
import ReactDOM from "react-dom";

import {sceneInit} from './audio-engine.js';

class App extends Component {

  componentDidMount() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', sceneInit);
  }

  //  style={{display: 'none'}}
  render() {
    return (
        <>
        <audio controls id="nietzsche" crossOrigin="anonymous">
            <source src="http://206.190.135.28:8332/stream/;.m3u"/>
        </audio>
        <audio controls id="shakespeare" crossOrigin="anonymous">
            <source src="https://streamingv2.shoutcast.com/JamendoLounge" type="audio/mpeg"/>
        </audio>
        <audio controls id="stream" crossOrigin="anonymous">
            <source src="http://streamingv2.shoutcast.com/ABC-Jazz" type="audio/mpeg"/>
        </audio>
        <video id="video" style={{display: 'none'}}></video>
        <div id="overlay">
          <button id="startButton">Play</button>
        </div>
        <div id="container"></div>
        <div ref={ref => (this.mount = ref)}/>
        </>
    )
  }
}


const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
export default App;
