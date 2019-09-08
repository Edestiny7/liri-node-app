// Read and set environment variables
require("dotenv").config();

// Variables
let keys = require("./keys.js");
let axios = require("axios");
let moment = require("moment");
let fs = require("fs");
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
let omdb = keys.omdb;
let bandsInTown = keys.bandsInTown;

// User input variables
let input = process.argv;
let entertainment = "";

// Collect user input
let command = input[2];
if (input[3] !== undefined) {
    entertainment = input.slice(3).join(" ");
} else {
    entertainment = input[3];
}

// Top seperator
console.log(`  ~-~`);

//Execute function
userInputs(command, entertainment);

// Switch function
function userInputs(command, entertainment) {
    switch (command) {
        case 'concert-this':
            concert(entertainment);
            break;
        case 'spotify-this-song':
            song(entertainment);
            break;
        case 'movie-this':
            movie(entertainment);
            break;
        case 'do-what-it-says':
            random();
            break;
        default:
            console.log(`  Command not found. Please type one of the following:
  concert-this
  spotify-this-song
  movie-this
  do-what-it-says'
  ~-~`);
    }
}

//Concert API function
function concert(entertainment) {
    if (command === 'concert-this') {
        if (entertainment === undefined) {
            console.log("Please specify an artist");
            return;
        }
        axios.get("https://rest.bandsintown.com/artists/" + entertainment + "/events?app_id=" + bandsInTown.id).then(
                function(response) {
                    responseData = response.data;
                    //console.log(responseData);
                    for (i in response.data) {
                        let cArtist = responseData[i].lineup[0];
                        let cName = responseData[i].venue.name;
                        let cCity = responseData[i].venue.city;
                        let cState = responseData[i].venue.region;
                        let cCountry = responseData[i].venue.country;
                        let cDate = moment(responseData[i].datetime).format("MM/DD/YYYY");
                        if (cState === "") {
                            cState = cCountry;
                        }
                        // Display response in console to user
                        console.log(`  ${cArtist} performs at ${cName} in ${cCity}, ${cState} on ${cDate}
  ~-~`);
                        // Append response to log.txt file
                        fs.appendFileSync("log.txt", `  ${cArtist} performs at ${cName} in ${cCity}, ${cState} on ${cDate}
  ~-~
`, function(err) {
                            if (err) throw err;
                        });
                    }
                }
            )
            .catch(function(err) {
                console.log(err);
            });
    }
}

//Song API function
function song(entertainment) {
    if (command === 'spotify-this-song') {
        if (entertainment === undefined) {
            entertainment = "The Sign - Ace of Base";
        }
        spotify
            .search({ type: 'track', query: entertainment, limit: 1 }).then(
                function(response) {
                    responseData = response.tracks.items[0];
                    let sName = responseData.album.artists[0].name;
                    let sSong = responseData.name;
                    let sPreviewLink = responseData.preview_url;
                    let sAlbum = responseData.album.name;

                    // Display response in console to user
                    console.log(`  Artist(s): ${sName}
  Song: ${sSong}
  Preview: ${sPreviewLink}
  Album: ${sAlbum}
  ~-~`);

                    // Append response to log.txt file
                    fs.appendFile("log.txt",
                        `  Artist(s): ${sName}
  Song: ${sSong}
  Preview: ${sPreviewLink}
  Album: ${sAlbum}
  ~-~
`,
                        function(err) {
                            if (err) throw err;
                        });
                })
            .catch(function(err) {
                console.log(err);
            });
    }
}

//Movie API function
function movie(entertainment) {
    if (command === 'movie-this') {
        if (entertainment === undefined) {
            entertainment = "Mr. Nobody";
            console.log(`  If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
  It's on Netflix!
`);
            fs.appendFileSync("log.txt",
                `  If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
  It's on Netflix!
`);
        }
        axios.get("http://www.omdbapi.com/?t=" + entertainment + "&apikey=" + omdb.id).then(
            function(response) {
                responseData = response.data;
                let mTitle = responseData.Title;
                let mYear = responseData.Year;
                let mRating = responseData.imdbRating;
                let mRottenTomatoesRating = responseData.Ratings[1].Value;
                let mCountry = responseData.Country;
                let mLanguage = responseData.Language;
                let mPlot = responseData.Plot;
                let mActors = responseData.Actors;

                // Display response in console to user
                console.log(
                    `  Title: ${mTitle}
  Release Year: ${mYear}
  IMDB Rating: ${mRating}
  Rotten Tomatoes Rating: ${mRottenTomatoesRating}
  Country: ${mCountry}
  Language: ${mLanguage}
  Plot: ${mPlot}
  Cast: ${mActors}
  ~-~`);
                // Append response to log.txt file
                fs.appendFile("log.txt",
                    `  Title: ${mTitle}
  Release Year: ${mYear}
  IMDB Rating: ${mRating}
  Rotten Tomatoes Rating: ${mRottenTomatoesRating}
  Country: ${mCountry}
  Language: ${mLanguage}
  Plot: ${mPlot}
  Cast: ${mActors}
  ~-~
`,
                    function(err) {
                        if (err) throw err;
                    });
            },
        )
    }
}

// random function
function random() {
    if (command === 'do-what-it-says') {
        // Read random.txt file
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
                return console.log(err);
            } else {
                // Create array with random.txt data.
                let randomArray = data.split(",");

                // Set input to first item in array.
                command = randomArray[0];

                // Set entertainment to second item in array.
                entertainment = randomArray[1];
                entertainment.trim();
                // Calls main controller to do something based on command and entertainment.
                userInputs(command, entertainment);
            }
        });
    }
}