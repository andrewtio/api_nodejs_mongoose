// === SETTINGAN STANDARD ====

var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var router     = express.Router();
var port       = process.env.PORT || 3000;

// === SETTINGAN DATABASE ====
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/apiusers');

var User = require('./models/user');

// === KONFIGURASI bodyParser ===
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// MIDDLEWARE
router.use(function(req, res, next){
    console.log('Time: ', Date.now());
    next();
    // next harus dituliskan karena jika tidak, tidak akan bisa lanjut ke kode di bawahnya
});

// === DAFTAR ENDPOINT ===
// /api/users           :GET :POST
// /api/users/:name     :GET :PUT  :DELETE
// tinggal di atur di URL nya ingin END POINT yang mana

// test router
router.get('/', function(req, res){
    res.json({ message: "Anda berada di Home!"})
});

// Ini untuk ngetest awal
// router.get('/users', function(req, res){
//     res.json({ username:"hilman", password: "123"});
// });

router.route('/users')

    .post(function(req, res){

        var user      = new User();
        user.name     = req.body.name;
        user.password = req.body.password;

        user.save(function(err){
            if(err) res.send(err);

            res.json({message: "user berhasil dimasukkan"});
    });

}).get(function(req, res){
    User.find(function(err, users){
        if(err) res.send(err);
        res.json(users);
    });
});

router.route('/users/:name')
    .get(function(req, res){
        User.find({name:req.params.name}, function(err,user){
            if(err) res.send(err);
            res.json(user);
        });
  }).put(function(req, res){
      User.update(
        { name:req.params.name },
        { name:req.body.name },
        function(err, user){
          if(err) res.send(err);
          res.json(" user berhasil diupdate! ");
      });
  }).delete(function(req, res){
      User.remove({
          name: req.params.name
      }, function(err, user){
          if(err) res.send(err);
          res.json({message: "user berhasil dihapus!"});
      });
  });

// === PREFIX API ===
app.use('/api', router);

app.listen(port);
console.log(' port run on.. ' + port);