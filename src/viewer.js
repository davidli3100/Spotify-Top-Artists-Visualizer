import React, { Component } from 'react';
import sketch from './views/sketch';
import P5Wrapper from './views/P5Wrapper';

// just a basic component to wrap the sketch
export default class Viewer extends Component {
    render() {
        return (
            <P5Wrapper sketch={sketch}/>
        )
}
}