require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

let mongooseConnection = "";

const port = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Define Database Name
const database = "wikiDB"

// Determine whether it is localhost or mongoDB server
if (port === 3000) {
    mongooseConnection = `mongodb://localhost:27017/${database}`;
} else {
    mongooseConnection = process.env.MONGOOSE_CONNECTION + database;
}

// Mongoose connection to DB
mongoose.connect(mongooseConnection, {useNewUrlParser: true});

// Schema
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

// REQUEST TARGETING ALL ARTICLES

app.route("/articles")
    .get( (req, res) => {
        Article.find({}, (err, result) => {
            if(!err){
                res.send(result);
            } else {
                res.send(err);
            };
        });
    })
    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save((err) => {
            if (!err) {
                res.send("Successfully added a new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("Successfully delted all articles.");
            } else {
                res.send(err);
            }
        })
    });

// REQUESTS TARGETTING SPECIFIC ARTICLES, GET, PUT
app.route("/articles/:articleId")
    .get((req, res) => {
        const articleId = req.params.articleId;
        Article.findOne({_id: articleId}, (err, result) => {
            if(!err) {
                res.send(result)
            } else {
                res.send(err)
            }
        })
    })
    // PUT request replace the entire collection instead of just particular piece of the collection
    .put((req, res) => {
        const articleId = req.params.articleId;
        Article.update(
            {_id: articleId}, 
            {
                title: req.body.title,
                content: req.body.content
            },
            {overwrite: true},
            (err, result) => {
                if(!err) {
                    res.send(result)
                } else {
                    res.send(err)
                };
            }
        );
    })
    .patch((req, res) => {
        const articleId = req.params.articleId;
        Article.update(
            {_id: articleId}, 
            {$set: req.body},
            {overwrite: true},
            (err, result) => {
                if(!err) {
                    res.send(result)
                } else {
                    res.send(err)
                };
            }
        );
    })
    .delete((req, res) => {
        const articleId = req.params.articleId;
        Article.deleteOne(
            {_id: articleId}, 
            (err, result) => {
                if(!err) {
                    res.send(result)
                } else {
                    res.send(err)
                };
            }
        );
    });



app.listen(port, () => console.log(`Server listening on port ${port}`));

