import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import P5Wrapper from './views/P5Wrapper';
import sketch from './views/sketch';
import firebase from './firebase';
class App extends Component {
  render() {
    return (
      <div className="App">
      <script>
        {firebase}
      </script>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <P5Wrapper sketch={sketch} />
        </header>
      </div>
    );
  }
}

export default App;
