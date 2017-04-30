import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';
import path from 'path';
 
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'pug');

const publicPath = path.join(__dirname, 'public');
const bootstrapDistPath = path.join(__dirname, 'node_modules', 'bootstrap', 'dist');

app.use('/static', express.static(publicPath));
app.use('/static/bootstrap', express.static(bootstrapDistPath));

app.get('/', async (req, res, next) => {
  try {
    const clubs = await db.all('SELECT * FROM clubs');
    console.log(clubs);
    res.render('index', { title: 'Home', clubs: clubs });
  } catch (err) {
    next(err);
  }
});

app.get('/create', async (req, res, next) => {
  try {
    const context = { title: 'Register Club' };
    res.render('create', context);
  } catch (err) {
    next(err);
  }
});

app.get('/club', async (req, res, next) =>{
  try {
    res.render('club');
  } catch (err) {
    next(err);
  }
});
 
Promise.resolve()
  // First, try connect to the database 
  .then(() => db.open('./database.sqlite3', { Promise }))
  .then(() => db.migrate({ force: 'last' }))
  .catch(err => console.error(err.stack))
  // Finally, launch Node.js app 
  .finally(() => { 
    app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}!`)
    })
  });
