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


    let rects = [];
    var customMouseX, customMouseY;

    /**
     * @function
     * @name p.setup - Setup function within a regular P5 sketch
     * 
     * notice that I use the syntax <code>p.setup = function ()</code> to declare my setup function
     * This is because i need to explicitly declare that setup is a child function of my component property <code>p</code>
     * The P5 wrapper scripts will run setup accordingly
     */
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.P3D);
        p.smooth();
        p.ellipseMode(p.RADIUS);
        p.frameRate(600);
        getUserID()
        console.log(rects);
        p.rectMode(p.CORNER)
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
        // p.clear();
        p.background(180)
        p.drawArtistNodes(rects)
        
    }

    /**
     * think of this pattern as a weighted graph, traversing it and
     * weighing nodes based on a combined score of followers, popularity, and genres
     */

    p.drawArtistNodes = function (data) {
        //maps one range to another
        const mapToColour = (num, in_min, in_max, out_min, out_max) => {
            return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }

        /**
         * maps all the genres to return a value based on popularity, or randint if it's not a "main stream genre" 
         */
        const genreMap = (genres) => {
            try {
                for (var j = 0; j < genres.length; j++) {
                    if (genres[j].includes('pop')) {
                        //just returning values based on the popularity of said genre
                        return 100
                    } else if (genres[j].includes('rap') || genres[j].includes('hip')) {
                        return 95
                    } else if (genres[j].includes('rock')) {
                        return 90
                    } else {
                        //returns randint if it's not a popular genre
                        return Math.floor(Math.random() * (100 - 0 + 1)) + 0;

                    }
                }
            } catch (err) {
                return Math.floor(Math.random() * (100 - 0 + 1)) + 0;
            }
        }
        var xOffset = 125;
        var yOffset = 150;
        //self explanatory
        var truncateMaxLength = 7
        //draw a colored rectangle mapped to stats of artist with text inside
        //loop through all params first
        for (var i in data) {
            //render rect for text
            //fills the shape based on the mapToColour function that maps followers/popularity/genres to color
            p.fill(mapToColour(data[i].popularity, 0, 100, 0, 255), mapToColour(data[i].followers, 0, 35000000, 0, 255), genreMap(data[i].genres))
            p.rect(xOffset * i + 25, yOffset - 50, 100, 100)
            //render text
            p.textSize(20);
            p.noStroke()
            p.fill(255)
            try {
                //find length of the second portion of the artist's name (if available)
                var fNameLength = data[i].name.fName.length
            } catch (err) {
                console.log(err)
            }
            if (fNameLength > 7) {
                //try catch again because p5, that's why
                try {
                    //truncating lastname using substrings, then appending ellipses to it
                    var truncatedFirstName = data[i].name.fName.substring(0, truncateMaxLength - 2)
                    p.text(truncatedFirstName + '...', xOffset * i + 40, yOffset)
                } catch (err) {
                    console.log("error: " + data[i].name.lName)
                }
            } else {
                p.text(data[i].name.fName, xOffset * i + 40, yOffset)
            }
            //truncate text just in case
            // uses ALOT of try/catch statements since P5.js has many many issues
            try {
                //find length of the second portion of the artist's name (if available)
                var lNameLength = data[i].name.lName.length
            } catch (err) {
                console.log(err)
            }

            //if last name length is greater than 7, we have to truncate
            if (lNameLength > 7) {
                //try catch again because p5, that's why
                try {
                    //truncating lastname using substrings, then appending ellipses to it
                    var truncatedLastName = data[i].name.lName.substring(0, truncateMaxLength - 2)
                    p.text(truncatedLastName + '...', xOffset * i + 40, yOffset + 20)
                } catch (err) {
                    console.log("error: " + data[i].name.lName)
                }
            } else {
                //if their last name is shorter, just draw it in the correct position
                p.text(data[i].name.lName, xOffset * i + 40, yOffset + 20)
            }
            //check if they click on the artist node, then load the artists data
            if (customMouseX > xOffset * i + 25 && customMouseX < xOffset * i + 125 && customMouseY > yOffset - 50 && customMouseY < yOffset + 50) {
                //custom var to store genres for each artist so we can display genres in a nice format
                var genres = []
                for (var genre in data[i].genres) {
                    genres.push(data[i].genres[genre])
                }

                p.text("Followers:\n" + data[i].followers + "\nPopularity:\n" + data[i].popularity + "\nGenres:\n" + genres.join("\n"), xOffset * i + 30, yOffset + 90)

            }
        }


    }

    //custom function to track mouseX and mouseY position when clicked
    p.mouseClicked = function () {
        customMouseX = p.mouseX;
        customMouseY = p.mouseY;

    }

    p.getUser = function (id) {
        //why not, another try catch for effect
        try{
        p.loadJSON("https://spotifytrackdb.firebaseio.com/users/" + id + ".json?print=pretty", p.resolveUser);
        } catch(err) {
            console.log(err)
        }
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
            var temp = data["artist-data"].items[i].name
            var name = temp.split(' ')
            console.log(
                "name: " + name + "\n" +
                "followers: " + followers + "\n" +
                "popularity: " + popularity + "\n" +
                "genres: " + genres
            )

            rects.push({
                name: {
                    fName: name[0],
                    lName: name[1]
                },
                followers: followers,
                genres: genres,
                image: image,
                popularity: popularity,
                temp: ''
            })


            // draw an artist node, color a "border" square according to mapped RGB values based on followers, popularity, genres
            // p.drawArtistNode(name, image, genres, followers, popularity, i);
        }
    }

}