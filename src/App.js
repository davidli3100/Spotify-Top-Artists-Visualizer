import React, {Component} from 'react';
import './css/style.css';
import firebase from './firebase'; //just quickly sets a DB ref for the user
import Login from './login'; //login component
import Viewer from './viewer'; //import the Viewer component for the p5 sketch
import queryString from 'query-string'; //import queryString to take params from uri

class App extends Component {
  //simple contructor for this component, calling super() before and having a state already there so my get functions can push to it
  constructor() {
    super();
    this.state = {
      token: 'notLoggedIn'
    }
  }

  /**
   * launches this to check for access_tokens before the react components mount/render
   * to toggle correct view between P5 sketch or log in screen
   */
  componentWillMount() {
    /**
     * @name parsedToken
     * @param {string} URI
     * @returns {string} a formmated query string (access token)
     * 
     * takes the returned access token an user gives from the auth flow and returns an access token (completely parsed and encoded)
     */
    let parsed = queryString.parse(window.location.search);
    console.log(parsed);
    let accessToken = parsed.access_token;
    console.log(accessToken);

    //if an accessToken exists, set the state of access_token to true so the P5 sketch renders
    if (accessToken) {
      console.log('token found')
      this.state = {
        token: 'loggedIn'
      }  
    } else {
      console.log('token not found')
    }
    console.log(this.state)
    console.log(this.state.token)

  }

  render() {
    console.log(this.state.token)

    //if the user is logged in show the p5 sketch and analyze their data, else, show the log-in screen
    if(this.state.token === "loggedIn") {
      return (
        <div className = "App" >
        <header className = "App-header" >
        </header>         
        <Viewer />
        </div>
      );
    } else if(this.state.token === "notLoggedIn") {
    return ( 
    <div className = "App" >
    <header className = "App-header" >
    </header> 
    <Login />

    </div>
    );
  }
  }
}

export default App;