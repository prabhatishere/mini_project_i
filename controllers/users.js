const User = require("../models/user")

module.exports.rendersignupFrom = (req, res)=>{
    res.render("../views/users/signup.ejs");
}

module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.signup = async (req, res)=>{
    try{
      let {username, email, password } = req.body;
      const newUser = new User({email, username});
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser); 
      req.login(registeredUser, (err)=>{
        if(err){
          return next(err);
        }
        req.flash("success", "You are logged in");
        res.redirect("/listings");
      });
      
  
    }
    catch(err){
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  }

  module.exports.login = async(req, res)=>{
      req.flash("success", "Welcome back to NESTSEEK!");
      let redirectUrl = res.locals.redirectUrl || "/listings";
      res.redirect(redirectUrl);
      
    }


module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    })
    
  }