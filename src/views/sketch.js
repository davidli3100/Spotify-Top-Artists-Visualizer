export default function sketch(p) {

    /**
     * gets the access token based on params in the uri  
     * returns access_token as well to any functions that may require the access_token
     */

    function getAccessToken() {
        var uri = window.location.href;
        var url = new URL(uri);
        var access_token = url.searchParams.get("access_token");
        return access_token;
    }

    /**
     * gets userID based on the spotify "me" endpoint
     * uses http fetch function (similar to a GET)
     * headers for bearer auth with the access_token (which is obtained from the previous function)
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
            p.getUser(data.id);
        })
    }

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
        getUserID();
    }

    //just some prelim variables to hold user data
    let user = {};

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

    /**
     * think of this pattern as a weighted graph, traversing it using an algorithm similar to Prim's 
     * Forming connections (edges) based on a combined score of followers, popularity, and genres
     */
    p.drawArtistNode = function (name, image, genres, followers, popularity, pos) {
    
    }

    p.getUser = function (id) {
        p.loadJSON("https://spotifytrackdb.firebaseio.com/users/" + id + ".json?print=pretty", p.resolveUser);
    }


    /**
     * takes loaded user data from my firebase database, then parses it using a forEach key loop
     * returns parsed data into a songNode (function drawSongNode) which will draw a node on the screen
     */
    p.resolveUser = function (data) {
        console.log('json')
        console.log(data);

        /**
         * loops through the artist-data array and gets the individual artist items
         */
        for (var i in data["artist-data"].items) {
            var followers = data["artist-data"].items[i].followers.total
            var genres = data["artist-data"].items[i].genres
            var popularity = data["artist-data"].items[i].popularity
            var image = data["artist-data"].items[i].images[0].url
            var name = data["artist-data"].items[i].name
            console.log(
                "name: " + name + "\n" +
                "followers: " + followers + "\n" +
                "popularity: " + popularity + "\n" + 
                "genres: " + genres
            )
            p.drawArtistNode(name, image, genres, followers, popularity, i);
        }
    }

    p.resolveTracks = function (data) {
        var tempo = data.tempo;
        var danceability = data.danceability;
        test[0] = tempo
        test[1] = danceability
    }
}