/**
 * Getting an User's top tracks, storing to firebase under a key with UserID
 * Then calling firebase later with a HTTP request in my P5 sketch
 */
const fetch = require('node-fetch');
var firebase = require("firebase");


//config for firebase -  api key is public - not recommended that we do this, but for the purpose of a faster dev process...
var config = {
    apiKey: "AIzaSyBSM-eCLHyl6rqtMjsvQLUe4EMEyqXHxn8",
    authDomain: "spotifytrackdb.firebaseapp.com",
    databaseURL: "https://spotifytrackdb.firebaseio.com",
    projectId: "spotifytrackdb",
    storageBucket: "spotifytrackdb.appspot.com",
    messagingSenderId: "330242531124"
  };
  firebase.initializeApp(config);

  //create a ref to the overall db object
  var db = firebase.database();

/**
 * function gets accesstoken from window URI
 */
function getAccessToken() {
    var uri = window.location.href;
    var url = new URL(uri);
    var access_token = url.searchParams.get("access_token");
    return access_token;
}
 
/**
 * getUserID from spotify v1/me endpoint, so we can use userID to query for top artists later
 * Notice that this is all done using the fetch package - which is in async time
 */
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

/**
 * now that we have the user ID passed in from getUserID(), we get the user's top artists using another fetch function
 * then console.log data for debug purposes and run the next function using the data passed in asynchronously
 * if we were to just return id and data instead of passing it into a callback function, the getArtists function would need to resolve and return an async promise instead
 */
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

/** along the same lines - just wrote a get top tracks function in case it was needed.
* takes id, artistsData - passes it into another createUser function once we have the track data endpoint asynchronously fetched
*/
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

//create a ref for the users endpoint, create user specific ref, set the data to track and artist data
function createUser(id, trackData, artistData) {
    firebase.database().ref('users/' + id).set({
        'track-data': trackData,
        'artist-data': artistData
    });

}

getUserID();


