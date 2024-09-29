const {express, bcrypt, pool} = require ('../public/script/init');
const router = express.Router ();

router.get ('/', (req, res) => {
  res.render ('landing');
});

router.get ('/catatan', (req, res) => {
  res.render ('catatan');
});

router.get ('/to-do', (req, res) => {
  res.render ('todolist');
});

router.get ('/login', (req, res) => {
  res.render ('login', {error: req.session.error});
  req.session.error = null;
});

router.post ('/login', async (req, res) => {
  const {username, password} = req.body;
  try {
    const [rows] = await pool.query ('SELECT * FROM users WHERE username = ?', [
      username,
    ]);
    if (rows.length > 0) {
      const user = rows[0];
      const match = await bcrypt.compare (password, user.password);
      if (match) {
        req.session.userId = user.id;
        return res.redirect ('/dashboard');
      }
    }
    req.session.error = 'Username atau password salah!';
    res.redirect ('/login');
  } catch (error) {
    res.redirect ('/login');
  }
});

router.get ('/register', (req, res) => {
  res.render ('register');
});

router.post ('/register', async (req, res) => {
  const {username, password} = req.body;
  const hashedPassword = await bcrypt.hash (password, 10);

  try {
    await pool.query ('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      hashedPassword,
    ]);
    res.redirect ('/login');
  } catch (error) {
    res.render ('register', {error: 'Username sudah digunakan!'});
  }
});

router.get ('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect ('/login');
  }
  res.render ('dashboard', {userId: req.session.userId});
});

router.get ('/logout', (req, res) => {
  req.session.destroy ();
  res.redirect ('/login');
});

module.exports = router;
