const assert = require("assert");
let database = [];
let id = 0;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let {
      firstName,
      lastName,
      password,
      street,
      city,
      emailAdress,
      phoneNumber,
    } = user;
    try {
      assert(typeof firstName === "string", "Firstname must be a string");
      assert(typeof lastName === "string", "Lastname must be a string");
      assert(typeof password === "string", "password must be a string");
      assert(typeof street === "string", "street must be a string");
      assert(typeof city === "string", "city must be a string");
      assert(typeof emailAdress === "string", "emailAdress must be a string");
      assert(typeof phoneNumber === "string", "phoneNumer must be a string");

      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({
        status: 400,
        result: err.toString(),
      });
    }
    next();
  },
  addUser: (req, res) => {
    let user = req.body;
    let emailAdress = req.body.emailAdress;
    let controle;

    for (let i = 0; i < database.length; i++) {
      if (database[i].emailAdress == emailAdress) {
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
  },
  getAllUsers: (req, res) => {
    res.status(200).json({
      status: 200,
      result: database,
    });
  },
  getUserById: (req, res) => {
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
  },
  deleteUser: (req, res) => {
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
  },
  updateUser: (req, res) => {
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
  },
};
module.exports = controller;
