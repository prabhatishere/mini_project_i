const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("../views/listings/index.ejs", { allListings });
  }

module.exports.renderNewForm = (req, res) => {
  
  res.render("../views/listings/newform.ejs");
}

module.exports.showListing = async (req, res) => {
  let id = req.params.id;
  const listing = await Listing.findById(id).populate({path: "reviews",
  populate: {
    path: "author"
  },
  })
  .populate("owner");
  if(!listing){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings")
  }
  console.log(listing);
  res.render("../views/listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
     //Geocoding
     let response = await geocodingClient
     .forwardGeocode({
         query: req.body.location,
         limit: 1
     })
     .send();



  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "...", filename);
  const data = req.body;
  data.owner = req.user._id;
  data.image = {url, filename};

  data.geometry = response.body.features[0].geometry;
  await Listing.insertMany(data);
  console.log(data);
  req.flash("success", "New listing created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  // let id = req.params.id;
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to edit")
    return res.redirect(`/listings/${id}`);
  }
  let data = await Listing.findById(id);
  if(!data){
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listings")
  }

  let originalImageUrl = data.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
  res.render("../views/listings/edit.ejs", { data, originalImageUrl });
}

async (req, res) => {
  // const id = req.params.id;
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to edit")
    return res.redirect(`/listings/${id}`);
  }
  const newdata = req.body;
  let data = await Listing.findByIdAndUpdate(id, newdata, { new: true });
  console.log(data);
  req.flash("success", "Listing Updated");

  res.redirect(`/listings/${id}`);
}

module.exports.updateListing = async (req, res, next) => {
  // const id = req.params.id;
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to edit")
    return res.redirect(`/listings/${id}`);
  }
  const newdata = req.body;
  let data = await Listing.findByIdAndUpdate(id, newdata, { new: true });
  if(typeof req.file !== "undefined"){
    // data = await Listing.findByIdAndUpdate(id, { ...req.body.listing});
    let url = req.file.path;
    let filename = req.file.filename;
    data.image = {url, filename};
    await data.save();
    // await Listing.insertOne(data);
  }
  console.log(data); 
  req.flash("success", "Listing Updated");

  res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
  // const id = req.params.id;
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error", "You don't have permission to delete")
    return res.redirect(`/listings/${id}`);
  }
  let data = await Listing.findByIdAndDelete(id);
  console.log(data);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
}

