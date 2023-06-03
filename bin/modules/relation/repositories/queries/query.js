const collection = 'relation-real-test';

class Query {

  constructor(db) {
    this.db = db;
  }

  async findOne(parameter) {
    this.db.setCollection(collection);
    return this.db.findOne(parameter);
  }

  async findMany(parameter) {
    this.db.setCollection(collection);
    return this.db.findMany(parameter);
  }

  async countData(parameter) {
    this.db.setCollection(collection);
    return this.db.countData(parameter);
  }

  async aggregate(parameter) {
    this.db.setCollection(collection);
    return this.db.aggregate(parameter);
  }
}

module.exports = Query;
