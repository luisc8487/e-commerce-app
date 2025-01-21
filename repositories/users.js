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

  async randomId() {
    return crypto.randomBytes(4).toString("hex");
  }
}

const test = async () => {
  const repo = new UsersRepository("users.json");

  await repo.create({email: "e@e.com", password: "123456"});

  const users = await repo.getAll();

  console.log(users);
};

test();
