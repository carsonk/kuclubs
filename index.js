import express from 'express';
import Promise from 'bluebird';
import db from 'sqlite';
 
const app = express();
const port = process.env.PORT || 3000;
 
app.get('/post/:id', async (req, res, next) => {
  try {
    const [post, categories] = await Promise.all([
      db.get('SELECT * FROM Post WHERE id = ?', req.params.id),
      db.all('SELECT * FROM Category')
    ]);
    res.render('post', { post, categories });
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
