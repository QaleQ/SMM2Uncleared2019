if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mysql = require("mysql2/promise");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");

app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/public`));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.SECRET,
  })
);

app.listen(3000);

const styleImages = {
  'SMB1': 'https://seeklogo.com/images/S/super-mario-bros-logo-B712683EBE-seeklogo.com.png',
  'SMB3': 'https://seeklogo.com/images/S/super-mario-bros-3-logo-3F9AF3A1F1-seeklogo.com.png',
  'SMW': 'https://seeklogo.com/images/S/super-mario-world-logo-CC25D10D3A-seeklogo.com.png',
  'NSMBU': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/NSMBU_2D_Logo.svg',
  'SM3DW': 'https://static.wikia.nocookie.net/logopedia/images/e/e7/Logo_EN_-_Super_Mario_3D_World.png'
}

main();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_IP,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  });

  let [queryData, []] = await connection.query(`
    SELECT
    *
    ,DATE_FORMAT(upload_datetime, "%d-%m-%Y") AS upload_date_day
    ,TIME(upload_datetime) AS upload_date_time
    FROM levels
    ORDER BY upload_datetime ASC
    LIMIT 10;
  `);

  app.get("/", (req, res) => {
    res.render("home", { queryData, req, styleImages });
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      let [[query], []] = await connection.query(`SELECT * FROM users WHERE username=?`, username);
      let storedPassword = query.password;
      let loggedIn = await bcrypt.compare(password, storedPassword);
      if (!loggedIn) throw new Error("Something went wrong");
      req.session.user_id = query.id;
      req.session.username = query.username;
      res.redirect("/");
    } catch (err) {
      res.render("login", { err });
    }
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.post("/signup", async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const userData = {
        username,
        password: hashedPassword,
        email,
      };
      let query = await connection.query(`INSERT INTO users SET ?`, userData);
      req.session.user_id = query.id;
      req.session.username = query.username;
      res.status(201).send();
    } catch (err) {
      res.render("signup", { err });
    }
  });

  app.post("/logout", async (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });


  app.get('/naked', (req, res) => {
    res.render('naked')
  })
}
