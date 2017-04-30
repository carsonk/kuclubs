import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';
import path from 'path';
import bodyParser from 'body-parser';

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

app.get('/', async (req, res, next) => {
  try {
    const clubs = await db.all('SELECT * FROM clubs');
    res.render('index', { title: 'Home', clubs: clubs });
  } catch (err) {
    next(err);
  }
});

app.get('/create', (req, res, next) => {
  try {
    const context = { title: 'Register Club' };
    res.render('create', context);
  } catch (err) {
    next(err);
  }
});

app.post('/create', async (req, res, next) => {
  let name = req.body.name;
  let description = req.body.description;
  let dateFounded = req.body.dateFounded;

  console.log(`POST request: name=${name} description=${description} dateFounded=${dateFounded}`);

  db.run('INSERT INTO clubs (name, description, date_founded) VALUES (?, ?, ?)', name, description, dateFounded);
  res.redirect('/');
});

app.get('/person/create', (req, res, next) => {
  const context = { title: 'Register Person' };
  res.render('create_person', context); 
});

app.post('/person/create', async (req, res, next) => {
  db.run('INSERT INTO persons (email, first_name, last_name) VALUES (?, ?, ?)',
         req.body.email, req.body.first_name, req.body.last_name);
  // TODO: Insert records into students or faculty, depending on group selection.
  res.redirect('/');
});

app.get('/club/:id', async (req, res, next) => {
  try {
    const [club, announcements, members] = await Promise.all([
      db.get('SELECT * FROM clubs WHERE id = ?', req.params.id),
      db.all('SELECT * FROM announcements WHERE club_id = ?', req.params.id),
      db.all('SELECT p.*, m.* FROM persons p LEFT JOIN membership m ON m.person_id = p.id WHERE m.club_id = ?', req.params.id)
    ]);
    const context = {
      title: 'Viewing ' + clubs.name, // Does pug clean these strings for us?
      club: club,
      announcements: announcements,
      members: members
    }
    res.render('club', context);
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
