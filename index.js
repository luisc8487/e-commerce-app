const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send(`
    <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button>Submit</button/>
        </form>
    </div>
    `);
});

app.post("/", (req, res) => {
    // get the data from the form
    res.send("Thanks for signing up!");
});

app.listen(3000, () => {
  console.log("Listening");
});
