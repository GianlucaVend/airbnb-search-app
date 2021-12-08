var express = require('express');
var mongoClient = require('./../mongo/config')
var mongoQueries = require('./../mongo/queries')
var router = express.Router();

// localhost:3000/airbnb
router.get('/', (req, res) => {
  res.render('airbnb', {title:'AirBnb', mongoHost:mongoClient.options.srvHost});
});

//Shows a single listing based on search 
router.get('/find-one', async (req,res)=>{

  console.log(req.query)

  let bedrooms =  parseInt(req.query.bedrooms);
  let beds = parseInt(req.query.beds);
  let reviews = parseInt(req.query.reviews);
  let country = req.query.country;

  let criteria = 
    {   bedrooms:{$gte: bedrooms}, 
        beds:{$gte: beds},
        number_of_reviews:{$gte:reviews}, 
        "address.country" :country
    }

  if (req.query.amenities)
    criteria ["amenities"] = {$all : req.query.amenities}

  let listing = await mongoQueries.findListing(criteria);
  res.render("listingOne", { listing });
})

//Shows summaries of many listings 
router.get('/find-many/:id?', async (req,res)=>{

  let country = req.query.country;
  let n_listings = 5; 
  let fileName;
  let criteria;
  let projection = {};

  if (req.query.n_listings)
  n_listings = req.query.n_listings <= 10 && req.query.n_listings >= 5 ? parseInt(req.query.n_listings) : 5; 

  if(req.params.id)
  {
    fileName = "listings";
    criteria = {
      _id: req.params.id
    }
    listings = await mongoQueries.findListing(criteria);
  }
  else 
  {
    fileName = "summaries";
    criteria = 
    {   bedrooms:{$gte:  parseInt(req.query.bedrooms)}, 
        "address.country" :country, 
    }

    listings = await mongoQueries.findListings(criteria,projection,n_listings);
  }

  res.render(fileName, { listings });
})

module.exports = router;