const router = require("express").Router();
const Movie = require("../models/Movie.model");
const Celebrity = require("../models/Celebrity.model");

// GET the create form
router.get("/movies/create", (req, res, next) => {
    Celebrity.find()
        .then((response) => {
            const data = {
                celebritiesArray: response,
            };
            res.render("movies/new-movie", data);
        })
        .catch((err) => {
            console.log("error when finding celebreties list. ", err);
            console.error(err);
        });
});

// POST create a new movie
router.post("/movies/create", (req, res, next) => {
    // console.log(req.body);
    Movie.create(req.body)
        .then((result) => {
            // console.log(result);
            res.redirect("/movies");
        })
        .catch((err) => {
            console.log("Could not create new movie. ", err);
            console.error(err);
            res.redirect("/movies/create");
        });
});

router.get("/movies/:id/edit", (req, res, next) => {
    let data = {};
    Movie.findById(req.params.id)
        .then((response) => {
            data.movieDetail = response;
            return Celebrity.find();
        })
        .then((CelebritiesResponse) => {
            data.celebritiesArray = CelebritiesResponse;
            res.render('movies/edit-movie', data)
        })
        .catch((err) => {
            console.log("Could not find the movie to edit. ", err);
            console.error(err);
        });
})

router.post("/movies/:id/edit", (req, res, next) => {
    const { title, genre, plot, cast } = req.body;
    Movie.findByIdAndUpdate(req.params.id, { title, genre, plot, cast }, { new: true })
        .then((response) =>{
            res.redirect(`/movies/${response.id}`);
        })
        .catch((err) => {
            console.log("Could not update the movie. ", err);
            console.error(err);
        });
})

router.get("/movies/:id", (req, res, next) => {
    Movie.findById(req.params.id)
        .populate("cast")
        .then((response) => {
            console.log(response);
            res.render("movies/movie-details", response);
        })
        .catch((err) => {
            console.log("Could not get movie from DB. ", err);
            console.error(err);
        });
});

router.get("/movies", (req, res, next) => {
    Movie.find()
        .then((response) => {
            const data = {
                moviesArray: response,
            };
            res.render("movies/movies", data);
        })
        .catch((err) => {
            console.log("Could not find movies from DB. ", err);
            console.error(err);
        });
});




router.post("/movies/:id/delete", (req, res, next) => {
    Movie.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect("/movies");
        })
        .catch((err) => {
            console.log("Deletion denied! ", err);
            console.error(err);
        });
});

module.exports = router;
