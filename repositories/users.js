const fs = require("fs");
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
}

const test = async () => {
  const repo = new UsersRepository("users.json");

  await repo.update("0000000", {"password": "mypassword"});
};

test();
