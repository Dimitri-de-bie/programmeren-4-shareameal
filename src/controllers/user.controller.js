const assert = require("assert");
const dbconnection = require("../../database");
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
      const error = {
        status: 400,
        result: err.message,
      };
      next(error);
    }
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
    // res.status(200).json({
    //   status: 200,
    //   result: database,
    // });

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
        res.status(200).json({
          statusCode: 200,
          results: results,
        });
        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
  getUserById: (req, res, next) => {
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
      const error = {
        status: 401,
        result: `User with ID ${userId} not found`,
      };
      next(error);
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
