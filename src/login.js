import React, { Component } from 'react';
import './App.css';

//title just shows the text
class Title extends Component {
    render () {
        return (
            <div className="title col-sm-12">
                <h1 id="start-title"> Spotify Top Track Analyser </h1>
                <h4> Connect Your Spotify Account to Continue </h4>
            </div>
        )
    }
}

//simple button component I made 
class Button extends Component {
    render () {
        return (
            <div className="get_started col-sm-12">
                <a className="start_btn btn-sm btn-success" href="http://localhost:8888/login">Connect To Spotify</a>
            </div>
        )
    }
}

//exported component containing both classes here 
export default class login extends Component {
    render() {
        return (
            <div className="login--container">
            <Title/>
            <Button/>
        </div>
        )
    }
}