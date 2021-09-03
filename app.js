require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID, //dotenv - process.env ("." files will not be pushed to git hub, we should never push credentials to git hub)
    clientSecret: process.env.CLIENT_SECRET
});
  
// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

// Our routes go here:

//1. create a route /index
//render a view called index.hbs
//in index.hbs, create a form with artistName field
//this form should redirect to /artist-search
//with a querystring http://localhost:3000?artistName="artist name searched"
app.get("/", (req, res) => {
    res.render("index");
});

//2. create an /artist-search route
//get the artistName that comes form the query params
//pass that artist name to
// spotifyApi
//   .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
//   .then(data => {
//     console.log('The received data from the API: ', data.body);
//     // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
//   })
//   .catch(err => console.log('The error while searching artists occurred: ', err));

// app.get("/artist-search", (req, res) => {
//     const {artistName} = req.query;
//     console.log(artistName);
//     const artistSearchResults = spotifyApi
//         .searchArtists(artistName)
//         .then(data => {
//             console.log('The received data from the API: ', data.body);
//             res.render("artist-search-results", {artistSearchResults});
//         })
//         .catch(err => console.log('The error while searching artists occurred: ', err));
    
// });

app.get("/artist-search", async (req, res) => {
    const data = await spotifyApi.searchArtists(req.query.artistName);
    console.log(data.body.artists.items);
    const allArtists = data.body.artists.items;
    //3. create an artist-search-results view
    //render that view passing allArtists
    //iterate through all artists in the view (each)
    //display their name and id
    res.render("artist-search-results", {allArtists});
});

app.get("/albums/:artistId", async (req, res) => {
    const data = await spotifyApi.getArtistAlbums(req.params.artistId);
    const albums = data.body.items;
    console.log("Album info", albums)
    res.render("albums", {albums});
});

app.get("/tracks/:albumId", async (req, res) => {
    const data = await spotifyApi.getAlbumTracks(req.params.albumId);
    const tracks = data.body.items;
    console.log("Tracks", tracks)
    res.render("tracks", {tracks});
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
