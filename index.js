import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';
import path from 'path';
import bodyParser from 'body-parser';

import routes from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

const publicPath = path.join(__dirname, 'public');
const bootstrapDistPath = path.join(__dirname, 'node_modules', 'bootstrap', 'dist');

app.use('/static', express.static(publicPath));
app.use('/static/bootstrap', express.static(bootstrapDistPath));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

routes(app);

Promise.resolve()
  // First, try connect to the database 
  .then(() => db.open('./database.sqlite3', { Promise }))
  .then(() => db.migrate())
  .catch(err => console.error(err.stack))
  // Finally, launch Node.js app 
  .finally(() => { 
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}!`)
    })
  });
