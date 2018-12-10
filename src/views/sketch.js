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
     * think of this pattern as a weighted graph, traversing it using an algorithm similar to Prim's 
     * Forming connections (edges) based on a combined score of followers, popularity, and genres
     */

    p.drawArtistNodes = function (data) {
        //maps one range to another
        const mapToColour = (num, in_min, in_max, out_min, out_max) => {
            return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
          }

        const genreMap = (genres) => {
            for(var j = 0; j < genres.length; j++) {
                if(genres[j].includes('pop')) {
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
        }
        var xOffset = 125;
        var yOffset = 150;
        var truncateMaxLength = 7
        //draw a colored rectangle mapped to stats of artist with text inside
        //loop through all params first
        for (var i in data) {
            //render rect for text
            p.fill(mapToColour(data[i].popularity, 0, 100, 0, 255), mapToColour(data[i].followers, 0, 35000000, 0, 255), genreMap(data[i].genres))
            p.rect(xOffset*i+25, yOffset-50, 100, 100)
            //render text
            p.textSize(20);
            p.noStroke()
            p.fill(255)
            p.text(data[i].name.fName, xOffset*i+40, yOffset)
            //truncate text just in case
            try{
            var lNameLength = data[i].name.lName.length
            } catch(err) {
                console.log(err)
            }
            if(lNameLength > 7) {
                try {
                var truncatedLastName = data[i].name.lName.substring(0, truncateMaxLength-2)
                p.text(truncatedLastName + '...', xOffset*i+40, yOffset+20)
                } catch(err) {
                    console.log("error: " + data[i].name.lName)
                }
            } else {
                p.text(data[i].name.lName, xOffset*i+40, yOffset+20)
            }
            if(customMouseX > xOffset*i+25  && customMouseX < xOffset*i+125 && customMouseY > yOffset-50 && customMouseY < yOffset+50) {
                var genres = []
                for(var genre in data[i].genres) {
                    genres.push(data[i].genres[genre])
                }

                p.text("Followers:\n" + data[i].followers + "\nPopularity:\n" + data[i].popularity + "\nGenres:\n" + genres.join("\n"), xOffset*i+30, yOffset+90)
                
            }
        }
        

    }
    p.mouseClicked = function() {
        customMouseX = p.mouseX;
        customMouseY = p.mouseY;
        
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