// modules that provide access to the file system such as reading, writing and deleting files and directories
const fs = require("fs");
// crypto module provides cryptographic functions
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("A filename is required");
    }

    this.filename = filename;
    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    // Open the file called this.filename
    return JSON.parse(
      await fs.promises.readFile(this.filename, {
        encoding: "utf-8",
      })
    );
  }

  async create(attrs) {
    attrs.id = this.randomId();
    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => record.id === id);
  }

  async delete(id) {
    const records = await this.getAll();
    const filterRecords = records.filter((record) => record.id !== id);
    await this.writeAll(filterRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const recordToUpdate = records.find((record) => record.id === id);

    if (!recordToUpdate) {
      throw new Error(`Record with id ${id} not found`);
    }
    Object.assign(recordToUpdate, attrs);
    await this.writeAll(records);
  }

  async getOneBy(filters) {
    const records = await this.getAll();

    for (let record of records) {
      let found = true;

      for (let key in filters) {
        if (record[key] !== filters[key]) {
          found = false;
        }
      }
      if (found) {
        return record;
      }
    }
  }
}

module.exports = new UsersRepository("users.json");
