const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(
  cookieSession({
    keys: ["kjnonijroij09j"],
  })
);

app.get("/signup", (req, res) => {
  res.send(`
    <div>
   Your id is ${req.session.userId}
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="password confirmation"/>
            <button>Submit</button/>
        </form>
    </div>
    `);
});

app.post("/signup", async (req, res) => {
  const {email, password, passwordConfirmation} = req.body;

  const existingUser = await usersRepo.getOneBy({email});

  if (existingUser) {
    return res.send("Email in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  // Create the user in our user repo to represent this person
  const user = await usersRepo.create({email, password});

  // Store the id of that user inside the users cookie
  req.session.userId = user.id;

  res.send("Thanks for signing up!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("You are signed out");
});

app.get("/signin", (req, res) => {
  res.send(`
     <div>
        <form method="POST">
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <button>Sign in</button/>
        </form>
      </div>
    `);
});

app.post("/signin", async(req, res) => {});

app.listen(3000, () => {
  console.log("Listening");
});
