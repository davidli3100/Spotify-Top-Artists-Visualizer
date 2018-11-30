/**
 * Getting an User's top tracks, storing to firebase under a key with UserID
 * Then calling firebase later with a HTTP request in my P5 sketch
 */
const fetch = require('node-fetch');
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyBSM-eCLHyl6rqtMjsvQLUe4EMEyqXHxn8",
    authDomain: "spotifytrackdb.firebaseapp.com",
    databaseURL: "https://spotifytrackdb.firebaseio.com",
    projectId: "spotifytrackdb",
    storageBucket: "spotifytrackdb.appspot.com",
    messagingSenderId: "330242531124"
  };
  firebase.initializeApp(config);

  var db = firebase.database();

function getAccessToken() {
    var uri = window.location.href;
    var url = new URL(uri);
    var access_token = url.searchParams.get("access_token");
    return access_token;
}
 
function getUserID() {
    var access_token = getAccessToken();
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(res => res.json()).then(data => {
        console.log("user data");
        console.log(data);
        getArtists(data.id);
    })
}

function getArtists(id) {
    var access_token = getAccessToken();
    fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(res => res.json()).then(data => {
        console.log("artist data");
        console.log(data);
        getTracks(id, data)
    })
}

function getTracks(id, artistData) {
    var access_token = getAccessToken(); 
    fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(res => res.json()).then(data => {
        console.log('songs');
        console.log(data);
        createUser(id, data, artistData);
        })
}

// function getRecommendations(id, trackData, artistData) {
//     var access_token = getAccessToken();
//     var artists = {};
//     for()
//     artists.push({
//         artistData.
//     })
//     fetch()
// }

function createUser(id, trackData, artistData) {
    firebase.database().ref('users/' + id).set({
        'track-data': trackData,
        'artist-data': artistData
    });

}

getUserID();


