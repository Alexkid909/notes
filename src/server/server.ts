const express = require('express');
// const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('../config/db');
const MongoClient = require('mongodb').MongoClient;

// dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, (err: any, database: any) => {
    (err) && console.log(err);
    const db = database.db('alexkid909_notes');

    require('../app/routes')(app, db);
    app.listen(app.get('port'), () => {
        var date = new Date().toString();
        console.log(date);
        console.log(('App is running at http://localhost:%d in %s mode'),
            app.get('port'), app.get('env'));
        console.log('Press CTRL-C to stop\n');
    });
});



// module.exports = app;
