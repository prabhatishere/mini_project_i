if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const { Long } = require("mongodb");
const app = express();
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const mongoose = require("mongoose");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine ", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

 



const listingsRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/reviews.js"); 
const userRouter = require("./routes/user.js"); 

const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => {
    console.log("Connection Succesfull");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8000, () => {
  console.log("server Started at 8000");
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


const store = MongoStore.create({
  mongoUrl: dbUrl, 
  crypto : {
      secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, 
});

store.on("error", () => {
console.log("ERROR in MONGO SESSION STORE", err);
});
// app.get("/", (req, res) => {
//   res.send("Root IS Here");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "Delta-Student"
//   });
//   let registeredUser = await User.register(fakeUser, "helloWorld")
//   res.send(registeredUser);
// })




//Restructuring all routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res) => {
  throw new ExpressError(404, "PageNot Found");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "SomeThing Went Wrong" } = err;
  res.render("error.ejs", { message });
  // res.status(statusCode).send(message)
  // res.send("Something Went Wrong11");
});
