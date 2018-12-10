import React, { Component } from 'react';
import './App.css';

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

class Button extends Component {
    render () {
        return (
            <div className="get_started col-sm-12">
                <a className="start_btn btn-sm btn-success" href="http://localhost:8888/login">Connect To Spotify</a>
            </div>
        )
    }
}

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