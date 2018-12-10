# P5.js Spotify Visualizer

![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)

![image](https://i.imgur.com/u9AkCYv.png)


This Spotify Visualizer was created using the create-react-app npm package as a barebones framework and an Oauth Bridge Template
  - See your top 10 artists, categorized using colors
  - See error messages thrown right onto your very own screen (!!!)
  - Fueled by Red Bull Tropical and working until 5am
  - ***Disclaimer:*** Documentation may harm your mental health

## New Features!

  - It works
  - Auth token expires after one hour (definitely a feature)


## How to Use
  - Make sure you have listening activity on spotify
  - Log in with spotify
  - Success! Now you can watch a bland background and some rectangles do stuff


## Known Errors

Didn't have enough time to fully try/catch everything so uh there's quite a few of them

* Random exceptions -> just close the error screen when it pops up (sometimes Spotify throws a 502 error on their side)
* Undefined values -> P5.js is dumb a lot of times and it'll return undefined values for my arrays when there's a clearly defined value. Even in async time
* Weird flickering on the squares, I have to loop through to draw the rects so it's a little weird 


### File Structure

A brief outline of the important files that are in this repo

| Path | Description |
| ------ | ------ |
| frontend/src/firebase.js | Makes asynchronous API calls to get Spotify User Data and save it to firebase so we can load JSON from P5 |
| frontend/src/P5Wrapper.js | React component that takes a P5 sketch as input and renders it (better cross-platform in-browser performance) |
| frontend/src/js/sketch.js | Where my P5 sketch and some API calls reside |
| backend/server.js | Basic OAuth Bridge to instantiate Spotify Auth flows and pass tokens to my frontend server |



### Development

Want to run this on your local machine?

Clone this github repo and install the LTS version of Node.js
You will also need to sign in as a [Spotify Developer](https://developer.spotify.com) and create an app 

In the app, you will need your CLIENT_ID and CLIENT_SECRET, make sure to set your callback URLs to ```localhost:yourPort/callback```

In each folder, create a ```.env``` file to store your environment variables. 

In the backend folder, add these variables to the ```.env``` file you created

| Variable | Description |
| ------ | ------ |
| PORT | The port you want the frontend server to run off of (defaults to 8888) |
| SPOTIFY_CLIENT_ID | The Spotify Client ID (obtained from your developer dashboard) |
|SPOTIFY_CLIENT_SECRET| Spotify Client Secret |
|REDIRECT_URI| The URI spotify will run a callback redirect on with the access codes|
|FRONTEND_URI| The URI where the front end server is running (defaults to localhost:3000)

Open your favorite Terminal and run these commands.

First Tab:
```sh
$ cd frontend
$ npm install
$ npm start

```


Second Tab:
```sh
$ cd backend
$ npm install
$ npm start
```
At this point, React-scripts would have opened a browser tab with the app in it. Verify that logging in and getting callbacks works. Then you're free to modify this!



### Todos

 - Write MORE Tests
 - more try/catch for server response errors 
 - pop up modal for more options to change the patterns
 - fully implement refresh tokens so access tokens can automatically refresh after the 60 minute limit
 - display API data in a more pretty way





