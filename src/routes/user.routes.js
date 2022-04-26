const express = require("express");
const router = express.Router();

let database = [];
let id = 0;

router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World!",
  });
});

//https://dimitri-sharemeal.herokurouter.com/

//json die is post die ik mee geef
// {
//   "name": "",
//   "email": "",
//   "geboortejaar":
// }

//user toevoegen
router.post("/api/user", (req, res) => {
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
router.get("/api/user/:userId", (req, res, next) => {
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
router.post("/api/user/:userId", (req, res, next) => {
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
router.delete("/api/user/:userId", (req, res, next) => {
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
router.get("/api/user", (req, res, next) => {
  res.status(200).json({
    status: 200,
    result: database,
  });
});
//personal user ophalen
router.get("/api/personaluser", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "deze funtionaliteit is nog niet geraliseerd",
  });
});

module.exports = router;
