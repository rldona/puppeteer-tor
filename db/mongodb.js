const MongoClient     = require('mongodb').MongoClient;

const dbConnectionUrl = 'mongodb+srv://rldona:NTkXp5z9nPGkquv2@filmaffinity-db-cluster.qdjua.mongodb.net/filmaffinity-db?retryWrites=true&w=majority';

async function initialize () {
  return await MongoClient.connect(dbConnectionUrl, {
    useUnifiedTopology: true
  });
}

async function getCollection (dbInstance, dbName, dbCollectionName) {
  const dbObject     = await dbInstance.db(dbName);
  const dbCollection = await dbObject.collection(dbCollectionName);
  console.log(`[MongoDB connection] ==> ${dbCollectionName} ==> SUCCESS`);
  return dbCollection;
}

module.exports = {
  initialize,
  getCollection
};
