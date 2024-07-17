var express = require('express');
var router = express.Router();
const userModel = require("./users")
const postModel = require("./posts")
const localStrategy = require("passport-local");
const passport = require('passport');
const upload = require('./multer')

// authenticate*
passport.use(new localStrategy(userModel.authenticate()))


// handle file upload
router.post('/upload',isLoggedIn,upload.single('file'),async (req,res,next)=>{
  if(!req.file){
    return res.status(400).send("no files were given")

  }
  const user = await userModel.findOne({username:req.session.passport.user})

  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    User: user._id
  })

  user.posts.push(post._id)
  await user.save()
  res.redirect("/profile")
})



router.get("/",function(req,res){
  res.render("index")
}) 

// feed_page
router.get("/feed",function(req,res){
  res.render("feed")
})

// login
router.get("/login",function(req,res){
  // console.log(req.flash("error"))
  res.render("login",{error:req.flash('error')} )
});
// register
router.post('/register',function(req,res){
  const { username, email, fullname } = req.body;
  const userdata = new userModel({ username, email, fullname });

  userModel.register(userdata,req.body.password).then(function(registereduser){
    passport.authenticate("local")(req,res,function(){
      res.redirect('/profile')
    })
  }) 
  
}) 

router.get("/profile",isLoggedIn,async function(req,res){
  let user = await userModel.findOne({
    username: req.session.passport.user
  }).populate("posts")
  res.render("profile",{user})

})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/login",
  failureFlash: true
}),function(req,res){ })

router.get('/logout',function(req,res){
  req.logout(function(err){
    if(err){ return next(err); }
    res.redirect('/')
  })
})

 function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) {
    return next();
  } 
  res.redirect("/login")
 }


module.exports = router;
