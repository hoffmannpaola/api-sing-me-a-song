require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const genresRouter = require('./routers/genresRouter');
const recommendationsRouter = require('./routers/recommendationsRouter');

require('./utils/loadRelationships');

//Define Routes
app.use('/genres', genresRouter);
app.use('/recommendations', recommendationsRouter);


module.exports = app;