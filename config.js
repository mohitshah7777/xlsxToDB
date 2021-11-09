const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("connected to database");
    })
    .catch((e) => {
        console.log("could not connect to database", e);
        process.exit();
    })