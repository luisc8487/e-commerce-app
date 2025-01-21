const fs = require("fs");
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
}

const test = async () => {
  const repo = new UsersRepository("users.json");

  const users = await repo.getAll();

  console.log(users);
};

test();
