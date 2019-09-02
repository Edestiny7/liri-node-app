require("dotenv").config();
let keys = require("./keys.js");
let spotify = new Spotify(keys.spotify);

//Make it so liri.js can take in one of the following commands:
/* 
* `concert-this`

* `spotify-this-song`

* `movie-this`

* `do-what-it-says` */