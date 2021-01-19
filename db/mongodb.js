const MongoClient = require('mongodb').MongoClient;

const dbConnectionUrl = 'mongodb+srv://rldona:NTkXp5z9nPGkquv2@filmaffinity-db-cluster.qdjua.mongodb.net/filmaffinity-db?retryWrites=true&w=majority';

/**
 * Connect to MongoDB Cloud (Atlas)
 */
async function initialize () {
  return await MongoClient.connect(dbConnectionUrl, {
    useUnifiedTopology: true
  });
}

/**
 *
 * @param {*} dbInstance
 * @param {*} dbName
 * @param {*} dbCollectionName
 */
async function getCollection (dbInstance, dbName, dbCollectionName) {
  const dbObject     = await dbInstance.db(dbName);
  const dbCollection = await dbObject.collection(dbCollectionName);
  console.log(`[MongoDB connection] ==> ${dbCollectionName} ==> SUCCESS`);
  return dbCollection;
}

/**
 *
 * @param {*} collection
 * @param {*} id
 * @param {*} review
 * @param {*} lastModified
 */
async function updateDocumentFromCollection (collection, id, review, lastModified) {
  await collection.updateOne (
    { 'index': id }, {
      $set: {
        'title': review.title,
        'duration': review.duration,
        'year': review.year,
        'directors': review.directors,
        'credits': review.credits,
        'casting': review.casting,
        'producer': review.producer,
        'genre': review.genre,
        'genres': review.genres,
        'sinopsis': review.sinopsis,
        'thumbnail_medium': review.thumbnail_medium,
        'rating_average': review.rating_average,
        'rating_count': review.rating_count,
        'professional_register': review.professional_register,
        'professional_reviews': review.professional_reviews,
        'country': review.country,
        'thumbnail_large': review.thumbnail_large
      },
      $currentDate: {
        'lastModified': lastModified
      }
    }
  )
}



/**
 *
 * @param {*} fildObj
 * @param {*} dbCollectionName
 *
 * Example filedObj:
 *
 * { "index": "id" }
 * { "index": "id", "rating_average": "ratingAverage" }
 *
 */
async function renameFieldFromCollection (fildObj, dbCollectionName) {
  await dbCollectionName.updateMany( {}, { $rename: fildObj } );
}

module.exports = {
  initialize,
  getCollection,
  updateDocumentFromCollection,
  renameFieldFromCollection
};
