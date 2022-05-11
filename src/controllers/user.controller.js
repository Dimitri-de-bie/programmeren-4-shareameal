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

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].emailAdress == emailAdress) {
            controle = false;
          }
        }
        // Handle error after the release.
        if (error) throw error;
        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
        connection.query(
          "SELECT MAX(id) as maxid FROM user;",
          function (error, results2, fields) {
            if (controle != false) {
              id = results2[0].maxid + 1;
              user = {
                id,
                ...user,
              };
              console.log(user);
              console.log(results2[0].maxid);
              connection.query(
                "INSERT INTO user (id, firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES(" +
                  id +
                  ",'" +
                  user.firstName +
                  "','" +
                  user.lastName +
                  "','','" +
                  user.emailAdress +
                  "','" +
                  user.password +
                  "'," +
                  user.phoneNumber +
                  ",'','" +
                  user.street +
                  "','" +
                  user.city +
                  "')"
              );
              res.status(201).json({
                status: 201,
                result: "User has been succesfully added",
              });
            } else {
              res.status(401).json({
                status: 401,
                result: "email bestaat al",
              });
            }
            connection.release();
            // dbconnection.end((err) => {
            //   console.log("pool was closed.");
            // });
          }
        );
      });
    });
  },
  getAllUsers: (req, res) => {
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

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
        let user = results.filter((item) => item.id == userId);
        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
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
        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
  deleteUser: (req, res) => {
    const userId = req.params.userId;
    console.log(`user met ID ${userId} gezocht`);

    let controle;
    let deletedeze;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == userId) {
            controle = false;
            break;
          }
        }
        // Use the connection
        if (controle == false) {
          connection.query(
            "DELETE FROM user WHERE user.id = " + userId + ";",
            function (error, results, fields) {
              // When done with the connection, release it.
              // Handle error after the release.
              if (error) throw error;

              // Don't use the connection here, it has been returned to the pool.
              console.log("#results = ", results.length);
              res.status(200).json({
                status: 200,
                result: `User with ID has been deleted!`,
              });

              connection.release();
              // dbconnection.end((err) => {
              //   console.log("pool was closed.");
              // });
            }
          );
        } else {
          res.status(401).json({
            status: 401,
            result: `User with ID ${userId} not found!`,
          });
        }
      });
    });
  },
  updateUser: (req, res) => {
    const userId = req.params.userId;
    console.log(`user met ID ${userId} gezocht`);

    let controle;
    let controle2 = true;
    let user = req.body;
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == userId) {
            controle = true;
          }
        }

        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
        if (controle == true) {
          connection.query(
            "SELECT * FROM user WHERE id = " + userId + "",
            function (error, results2, fields) {
              for (let i = 0; i < results.length; i++) {
                if (results[i].emailAdress == user.emailAdress) {
                  controle2 = false;
                  break;
                }
                if (results2[0].emailAdress == user.emailAdress) {
                  controle2 = true;
                  break;
                }
              }
              if (controle2 == true) {
                console.log(results2[0].emailAdress);
                // Handle error after the release.
                if (error) throw error;
                id = parseInt(userId);
                user = {
                  id,
                  ...user,
                };

                connection.query(
                  "UPDATE `user` SET `firstName`='" +
                    user.firstName +
                    "',`lastName`='" +
                    user.lastName +
                    "',`emailAdress`='" +
                    user.emailAdress +
                    "',`password`='" +
                    user.password +
                    "',`phoneNumber`='" +
                    user.phoneNumber +
                    "',`street`='" +
                    user.street +
                    "',`city`='" +
                    user.city +
                    "' WHERE id = " +
                    userId +
                    ""
                );
                console.log(user);
                res.status(201).json({
                  status: 201,
                  result: `User with ID ${userId} succesfully changed`,
                });
              } else {
                console.log(user.emailAdress);
                console.log(controle2);
                res.status(401).json({
                  status: 401,
                  result: `Email already exists`,
                });
              }
            }
          );
        } else {
          res.status(401).json({
            status: 401,
            result: `User with ID ${userId} not found`,
          });
        }

        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
};
module.exports = controller;
