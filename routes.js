import db from "sqlite";

export default (app) => {
  app.get('/', async (req, res, next) => {
    try {
      let query = 'SELECT c.*, count(m.person_id) member_count FROM clubs c'
      query += ' LEFT JOIN membership m ON m.club_id = c.id GROUP BY c.id';
      const clubs = await db.all(query);
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
    const person = await db.run('INSERT INTO persons (email, first_name, last_name) VALUES (?, ?, ?)',
      req.body.email, req.body.first_name, req.body.last_name);
    // TODO: Insert records into students or faculty, depending on group selection.
    if(req.body.group == 'student') {
      db.run('INSERT INTO students (person_id, class) VALUES (?, ?)', person.stmt.lastID, 'class level yo');
    } else if(req.body.group == 'faculty') {
      db.run('INSERT INTO faculty (person_id, department) VALUES (?, ?)', person.stmt.lastID, 'department yo');
    }
    res.redirect('/');
  });

  app.get('/club/:id', async (req, res, next) => {
    try {
      const [club, announcements, members] = await Promise.all([
        db.get('SELECT * FROM clubs WHERE id = ?', req.params.id),
        db.all('SELECT * FROM announcements WHERE club_id = ?', req.params.id),
        db.all('SELECT p.*, m.* FROM persons p INNER JOIN membership m ON m.person_id = p.id WHERE m.club_id = ?', req.params.id)
      ]);

      if (!club)
        res.status(404).send('Club was not found.');

      console.log(members);

      const context = {
        title: 'Viewing ' + club.name, // Does pug clean these strings for us?
        club: club,
        announcements: announcements,
        members: members
      }
      res.render('club', context);
    } catch (err) {
      next(err);
    }
  });

  async function clubAddMember(req, res, next, error) {
    try {
      const club = await db.get('SELECT * FROM clubs WHERE id = ?', req.params.id);
      const people = await db.all('SELECT * FROM persons ORDER BY last_name');

      if (!club)
        res.status(404).send('Club was not found...');

      const context = {
        title: 'Add Member to ' + club.name,
        club: club,
        people: people
      };
      res.render('add_club_member', context);
    } catch(err) {
      next(err);
    }
  }

  app.get('/club/:id/add', async(req, res, next) => {
    clubAddMember(req, res, next);
  });

  app.post('/club/:id/add', async(req, res, next) => {
    let error = null;
    try {
      const [club, person, member] = await Promise.all([
        db.get('SELECT * FROM clubs WHERE id = ?', req.params.id),
        db.all('SELECT * FROM persons ORDER BY last_name'),
        db.get('SELECT * FROM membership WHERE club_id = ? AND person_id = ?', req.params.id, req.body.person_id)
      ]);
    } catch(err) {
      next(err);
    }

    if (!club || !person) {
      res.status(404).send('Club or person was not found.');
      return;
    }

    if (member)
      error = 'That person is already a part of that club.';

    if (!error) {
      const is_officer = (req.body.is_officer) ? 1 : 0;
      let statement = 'INSERT INTO membership (person_id, club_id, joined, active, officer_title, is_officer)';
      statement += ' VALUES (?, ?, strftime(\'%s\', \'now\'), 1, ?, ?)';
      db.run(statement, req.body.person_id, req.params.id, req.body.officer_title, is_officer);
      res.redirect(`/club/${club.id}`);
    } else {
      clubAddMember(req, res, next, error);
    }
  });

  app.get('/club/:id/event/add', async (req, res, next) => {
    try {
      const club = await db.get('SELECT * FROM clubs WHERE id = ?', req.params.id);

      if (!club) {
        res.status(404).send('Club or person was not found.');
        return;
      }

      const context = { title: 'Add event', club: club };
      res.render('add_event', context);
    } catch(err) {
      next(err);
    }
  });
}
