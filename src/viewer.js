import React, { Component } from 'react';
import sketch from './views/sketch';
import P5Wrapper from './views/P5Wrapper';


export default class Viewer extends Component {
    render() {
        return (
            <P5Wrapper sketch={sketch}/>
        )
}
}