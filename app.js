const {express} = require ('./public/script/init');
const session = require ('express-session');
const controller = require ('./routes/controller');
const penyimpanan = require ('./routes/storage');
const app = express ();
const PORT = 3000;

app.use (express.urlencoded ({extended: true}));
app.use (session ({secret: 'secret', resave: false, saveUninitialized: true}));

app.set ('view engine', 'ejs');
app.use (express.static ('public'));

app.use (controller);
app.use (penyimpanan);

app.listen (PORT, () => {
  console.log (`Server running on http://localhost:${PORT}`);
});
