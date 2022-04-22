const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let database = [];
let id = 0;

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World!",
  });
});

//user toevoegen
app.post("/api/user", (req, res) => {
  let user = req.body;
  let email = req.body.email;
  let controle;

  for (let i = 0; i < database.length; i++) {
    if (database[i].email == email) {
      controle = false;
    }
  }
  if (controle != false) {
    id++;
    user = {
      id,
      ...user,
    };
    console.log(user);
    database.push(user);
    res.status(201).json({
      status: 201,
      result: database,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: "email bestaat al",
    });
  }
});

//specifieke user ophalen
app.get("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`user met ID ${userId} gezocht`);
  let user = database.filter((item) => item.id == userId);
  if (user.length > 0) {
    console.log(user);
    res.status(200).json({
      status: 200,
      result: user,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

//specifieke user updaten
app.post("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`user met ID ${userId} gezocht`);

  let controle;
  let deletedeze;

  for (let i = 0; i < database.length; i++) {
    if (database[i].id == userId) {
      controle = true;
      deletedeze = i;
      break;
    }
  }

  if (controle == true) {
    database.splice(deletedeze, 1);
    let user = req.body;
    id = parseInt(userId);
    user = {
      id,
      ...user,
    };
    console.log(user);
    database.push(user);
    res.status(201).json({
      status: 201,
      result: database,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});

//specifieke user deleten
app.delete("/api/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(`user met ID ${userId} gezocht`);
  let user = database.filter((item) => item.id == userId);

  let controle;
  let deletedeze;

  for (let i = 0; i < database.length; i++) {
    if (database[i].id == userId) {
      controle = true;
      deletedeze = i;
      break;
    }
  }

  if (controle == true) {
    database.splice(deletedeze, 1);
    console.log(user);
    res.status(200).json({
      status: 200,
      result: "user has been deleted",
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `User with ID ${userId} not found`,
    });
  }
});
//alle users ophalen
app.get("/api/user", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
});
//personal user ophalen
app.get("/api/personaluser", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "deze funtionaliteit is nog niet geraliseerd",
  });
});

app.post("/api/movie", (req, res) => {
  let movie = req.body;
  id++;
  movie = {
    id,
    ...movie,
  };
  console.log(movie);
  database.push(movie);
  res.status(201).json({
    status: 201,
    result: database,
  });
});

app.get("/api/movie/:movieId", (req, res, next) => {
  const movieId = req.params.movieId;
  console.log(`Movie met ID ${movieId} gezocht`);
  let movie = database.filter((item) => item.id == movieId);
  if (movie.length > 0) {
    console.log(movie);
    res.status(200).json({
      status: 200,
      result: movie,
    });
  } else {
    res.status(401).json({
      status: 401,
      result: `Movie with ID ${movieId} not found`,
    });
  }
});

app.get("/api/movie", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
});

app.all("*", (req, res) => {
  res.status(401).json({
    status: 401,
    result: "End-point not found",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
