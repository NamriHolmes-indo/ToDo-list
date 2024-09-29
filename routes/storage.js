const {express} = require ('../public/script/init');
const router = express.Router ();

router.post ('/simpan', (req, res) => {
  const content = req.body.content;
  const font = req.body.font;
  console.log ('Konten disimpan:', content);
  console.log ('Font yang dipilih:', font);
  res.send ('Konten berhasil disimpan dengan font ' + font + '!');
});

module.exports = router;
