const mongoClient = require("./config");

//find a single listing
async function findListing(criteria)
{
  let result = []
  await mongoClient.connect()
    .then(connection=>connection.db('sample_airbnb'))
    .then(db=>db.collection('listingsAndReviews'))
    .then(listingsAndReviews=>listingsAndReviews.findOne(criteria))
    .then(listing=>{ result = listing})
    .catch(error => console.log(error))
  return result
}

//find many listings
async function findListings(criteria, projection, nListings)
{
  let result = []
    await mongoClient.connect()
      .then(connection=>connection.db('sample_airbnb'))
      .then(db=>db.collection('listingsAndReviews'))
      .then(listingsAndReviews=>listingsAndReviews
        .find(criteria,{projection})
        .limit(nListings))
      .then(cursor=>cursor.toArray())
      .then(listings=>{ result = listings})
      .catch(error=>console.log(error))

      return result
}

module.exports = {findListing,findListings}  