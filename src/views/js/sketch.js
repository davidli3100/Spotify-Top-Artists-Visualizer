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
        p.getUser(data.id);
    })
}

var img;  // Declare variable 'img'.

function setup() {
  createCanvas(windowWidth, windowHeight, P2D);
  img = loadImage("https://i.scdn.co/image/221676462fd9e40847b9ccb4697cdd201dcc891b");  // Load the image
}

function draw() {
  // Displays the image at its actual size at point (0,0)
  image(img, 0, 0);
  // Displays the image at point (0, height/2) at half size
  image(img, 0, height/2, img.width/2, img.height/2);
}