// Modules/archivistAgent.js

class ArchivistAgent {
  constructor() {
    this.archive = [];
  }

  storeRecord(record) {
    this.archive.push(record);
    console.log('Record archived:', record);
  }

  retrieveAll() {
    console.log('Retrieving records:', this.archive);
    return this.archive;
  }
}

module.exports = ArchivistAgent;