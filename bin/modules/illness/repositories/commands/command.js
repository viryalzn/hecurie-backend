const collection = 'illness-dummy';
class Command {

  constructor(db) {
    this.db = db;
  }

  async insertOne(payload) {
    this.db.setCollection(collection);
    return this.db.insertOne(payload);
  }

  async upsertOne(parameter, document) {
    this.db.setCollection(collection);
    return this.db.upsertOne(parameter, document);
  }

  async updateArrayFilters(parameter, document, arrayFilters) {
    this.db.setCollection(collection);
    return this.db.updateArrayFilters(parameter, document, arrayFilters);
  }

  async updateMany(parameter, document) {
    this.db.setCollection(collection);
    return this.db.updateMany(parameter, document);
  }
}

module.exports = Command;
