const fetch = require('node-fetch');

function getTracks() {
    var uri = window.location.href;
    var url = new URL(uri);
    var access_token = url.searchParams.get("access_token");
    fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }).then(res => res.json()).then(data => console.log(data))
}

getTracks();

export default function sketch(p) {

    //need to limit rates so i don't make 60 api calls per second and get thrown a 429 error
    let rate = 0;

    //just initialize the array of values i will be using to visualize the BPM of a song
    let test = []

    //global var for the diameter of the ellipse which will be constantly changing
    var diameter;

    /**
     * @function
     * @name p.setup - Setup function within a regular P5 sketch
     * 
     * notice that I use the syntax <code>p.setup = function ()</code> to declare my setup function
     * This is because i need to explicitly declare that setup is a child function of my component property <code>p</code>
     * The P5 wrapper scripts will run setup accordingly
     */
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.P2D);
        p.ellipseMode(p.RADIUS);
        p.frameRate(600);
        p.getTopTracks(10, 0, 'medium_term');
    }


    /**
     * @function 
     * @name p.draw
     * 
     * draw function iterates at 60FPS for smoother rendering
     * as I said before, it is declared as <code>p.draw</code> so the P5Wrapper component can find the function
     */
    p.draw = function () {

        //clears background, making sketch transparent
        p.clear();

    }

    p.drawSongNode = function (title, image, danceability, valance, popularity) {
        
    }

    /**
     * @function
     * @name p.getAccessToken
     * @returns {string} - the payload of the request
     * 
     * same as the earlier get access token function, only this time makes it a p5 function just for consistency
     */
    p.getAccessToken = function () {
        var uri = window.location.href;
        var url = new URL(uri);
        var res = url.searchParams.get("access_token");
        return res
    }

    console.log(p.getAccessToken());

    /**
     * @function
     * @name p.getAudioFeatures 
     * @param {JSON} data - takes data passed in from the <code>p.getSongID</code> function
     * @returns {JSON} returns a JSON file of the audio analysis of the current song playing
     * 
     * 
     */
    p.getAudioFeatures = function (data) {
        var res = p.getAccessToken()
        console.log(data)
        var id = data.item.id
        var isPlaying = data.is_playing
        test[2] = isPlaying
        var audioFeatures = p.loadJSON("https://api.spotify.com/v1/audio-features/" + id + '?access_token=' + res, p.resolveAnalysis)
        console.log(audioFeatures)
    }

    p.getTopTracks = function (trackNum, offset, term) {
        var res = p.getAccessToken()
        var topTracks = p.loadJSON("https://api.spotify.com/v1/me/top/tracks?access_token=" + res, p.resolveTracks)
        console.log(topTracks);
    }

    p.resolveRecommendations = function(data) { 
               
    }

    p.resolveTracks = function(data) {
        var tempo = data.tempo;
        var danceability = data.danceability;
        test[0] = tempo
        test[1] = danceability
    }
}