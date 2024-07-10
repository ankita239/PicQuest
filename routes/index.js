var express = require('express');
const passport = require('passport');
var router = express.Router();
const userModel = require('./users');
const postModel = require('./posts');
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});



router.post('/fileupload', isLoggedIn ,upload.single('image'),async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user});
  user.profileImage = req.file.path;
  await user.save();
  res.redirect('/profile',)
})

router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = 
  await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts");
  console.log(user);
  res.render('profile',{user,nav:true});
});

router.get('/add', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render('add',{user,nav:true});
});

router.post('/createpost', isLoggedIn, upload.single('postImage'), async function(req, res) {
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    console.log('User Found:', user);

    if (!user) {
      return res.status(404).send('User not found');
    }

    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename
    });

    console.log('Post Created:', post);

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).send('Server Error');
  }
});


router.get('/login',function(req,res)
{
  res.render('login',{error:req.flash("error"), nav:false});
})

router.get('/register', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/about',function(req,res){
  res.render('about',{nav:true});
})

router.get('/show', isLoggedIn,async function(req,res){
  const user = await userModel.findOne({username: req.session.passport.user}).populate("posts");
  res.render('show',{user, nav:true})
})

router.get('/cardid', isLoggedIn ,async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts");
  const post = user.posts[0].image;
  res.render('cardid',{user,nav:false})
})

router.get('/feed', isLoggedIn, async function(req,res){
  const user = await userModel.findOne({username:req.session.passport.user}).populate("posts");
  const posts = await postModel.find().populate("user");
  res.render('feed',{user,posts,nav:true})
})

router.post('/register',function(req,res){
  var userData = new userModel({
    username : req.body.username,
    name: req.body.name,
    email: req.body.email,
    contact:req.body.contact
  });

  userModel.register(userData,req.body.password)
  .then(function(registeredUser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile');
    })
  })
})

router.post('/login',passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash: true
}))

router.get('/logout',function(req,res,next){
  req.logout(function(err){
    if(err) {
      return next(err);
    }
    res.redirect('/login');
  });
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    {
      return next();
    }
  res.redirect('/');
}

module.exports = router;
