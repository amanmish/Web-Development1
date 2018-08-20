var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    flash        = require("connect-flash"),
LocalStrategy   = require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    
    seedDB      = require("./seeds"),
    chatD       = require("./chatd")
    
    

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.use(express.static(__dirname + "/public"));
var ChatNotes=require("./models/campground");
app.use(flash());



// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds",isLoggedIn, function(req, res){
    
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});


//NEW - show form to create new campground
app.get("/campgrounds/new",isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});
//CREATE - add new Information to DB

app.post("/campgrounds",function(req,res)
{
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newInfo = {name: name, image: image, description: desc}
    
    ChatNotes.create(newInfo,function(err,newly)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    })
})
    
// SHOW - shows more info about one campground

app.get("/campgrounds/:id",function(req,res)
{
    ChatNotes.findById(req.params.id).populate("comments").exec(function(err,moreInfo)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(moreInfo)
            res.render("campgrounds/show",{campground:moreInfo});
        }

    })
})


app.delete("/campgrounds/:id", function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});


// ====================
// COMMENTS ROUTES
// ====================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
 
 


app.post("/campgrounds/:id/comments",isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});


// ====================
// CHAT ROUTES
// ====================
app.get('/chat', function(req, res) {
   
    res.render('chat');
});
   


//////////////////////////////////////////////////////

//  ===========
// AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register",function(req,res)
{
    var newUser=new User({username: req.body.username});
    User.register(newUser,req.body.password,function(err,user)
    {
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function()
        {
            res.redirect("/campgrounds");
        });
    })
});

// show login form
app.get("/login", function(req, res){
   res.render("login", {message: req.flash("error")}); 
});
// handling login logic
app.post("/login",passport.authenticate("local",
{
    successRedirect: "/",
    failureRedirect: "/login"
}),function(req,res)
{
 
});
// logic route
app.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.render("login");
}

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Chat Server Has Started!");
});

//About us route

app.get("/about",function(req,res){
    
    res.render("about")
})

//Guidance Portal

app.get("/guidence",function(req,res){
    
    res.render("guidence")
})



