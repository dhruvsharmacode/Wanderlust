const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); 

//Index Route
module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings})
};


//New Listing Create Route
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};


//Show Listing Route
module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");

    if(!listing) {
        req.flash("error", "Listing does not existed!");
        res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing})
}


//New Listing Create Route
module.exports.createListing = async(req,res, next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename)
    //let {title,description,location,country,image,price} = req.body;
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing)

    req.flash("success", "New Listing Created!")
    res.redirect("/listings")
}




//Edit Form Render Listing Route
module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not existed!");
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", {listing, originalImageUrl})
}



//Update Listing Form Render Route
module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

//Delete Listing Route
module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings")
}