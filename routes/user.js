const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// const { reviewSchema } = require("../schema.js");

const userController = require("../controllers/users.js");

router.get("/signup", userController.rendersignupFrom)


router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post("/login",
saveRedirectUrl,
 passport.authenticate("local", {
    failureRedirect : '/login',
     failureFlash : true}
        ),
      userController.login)

router.get("/logout", userController.logout)
// const { saveRedirectUrl } = require("../middleware.js");
// const userContorller = require("../controllers/users.js");

// router
//     .route("/signup")
 
//     .get( userContorller.rendersignupForm)

  
//     .post(wrapAsync( userContorller.signup ));


// router
//     .route("/login")
 
//     .get( userContorller.renderLoginForm)

   
//     .post( saveRedirectUrl,
//         passport.authenticate("local", {
//             failureRedirect: "/login", 
//             failureFlash: true,
//         }), 
//         userContorller.login
//     );


// router.get("/logout", userContorller.logout);


module.exports = router;