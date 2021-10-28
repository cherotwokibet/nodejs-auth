const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({dest: './uploads'});
const {User,getUserById,getUserByUsername,comparePassword} = require('../models/user');
const _=require('lodash');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', (req, res)=> {
  res.render('index',{title:'Members'});
});


router.get('/register', (req, res)=> {
  res.render('register',{title:'Register'});
});

router.get('/login', (req, res)=> {
  res.render('login', {title:'Login'});
});

router.post('/login',passport.authenticate('local',{failureRedirect:'/users/login'}),
(req,res)=>{
  console.log('........');
  res.redirect('/');
});

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  getUserById(id,(err,user)=>{
    done(err,user);
  });
});

passport.use(new LocalStrategy((username,password)=>{
  getUserByUsername(username,(err,user)=>{
    if(err) throw new Error(err.message);
    if(!user){
      return done(null,false,{message:'Unknown User'});
    }
    comparePassword(password, user.password,(err,isMatch)=>{
      if(err) return done(err);
      if(isMatch){
        return done(null,user);
      } else {
        return done(null,false,{message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register', upload.single('profileimage') , async (req, res)=> {
  if(req.file){
  	console.log('Uploading File...');
  	//const profileimage = req.file.filename;
  } else {
  	console.log('No File Uploaded...');
  	//const profileimage = 'noimage.jpg';
  }

  // Form Validator
  /*
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);*/

  // Check Errors
  //const errors = req.validationErrors();

  //if(errors){
  	//res.render('register', {
  	//	errors: errors
  	//});
  //} else{
  	let user = new User(_.pick(req.body, ['name', 'email', 'username','password','profileimage']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    //req.flash('success', 'You are now registered and can login');

    res.location('/');
    res.redirect('/');
  //}
});

module.exports = router;
