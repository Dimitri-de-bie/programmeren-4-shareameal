const assert = require("assert");
const jwt = require("jsonwebtoken");
const dbconnection = require("../../database");
const logger = require("../config/config").logger;
const jwtSecretKey = require("../config/config").jwtSecretKey;
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
    let emailcheck = false;
    let passwordcheck = false;

    //The personal_info part contains the following ASCII characters.
    // Uppercase (A-Z) and lowercase (a-z) English letters.
    // Digits (0-9).
    // Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
    // Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other.

    if (
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.emailAdress)
    ) {
      emailcheck = true;
    } else {
      res.status(400).json({
        status: 400,
        result: "email invalid",
      });
    }
    //To check a password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(req.body.password)) {
      passwordcheck = true;
    } else {
      res.status(400).json({
        status: 400,
        result: "password invalid",
      });
    }
    if (emailcheck == true && passwordcheck == true) {
      dbconnection.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(
          "SELECT * FROM user",
          function (error, results, fields) {
            // When done with the connection, release it.

            for (let i = 0; i < results.length; i++) {
              if (results[i].emailAdress == emailAdress) {
                controle = false;
              }
            }
            console.log(user.emailAdress);
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
                      "','1','" +
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
                  connection.release();
                } else {
                  res.status(409).json({
                    status: 409,
                    result: "email bestaat al",
                  });
                }
              }
            );
          }
        );
      });
    }
  },
  getAllUsers: (req, res, next) => {
    let { name, isActive } = req.query;
    console.log(`name = ${name} isActive = ${isActive}`);

    let queryString = "SELECT * FROM `user`";
    if (name || isActive) {
      queryString += " WHERE ";
      if (name) {
        queryString += `firstName LIKE ?`;
      }
      if (name && isActive) {
        queryString += `AND `;
      }
      if (isActive) {
        queryString += `isActive = ${isActive}`;
      }
    }
    queryString += ";";
    console.log(queryString);
    name = "%" + name + "%";

    dbconnection.getConnection(function (err, connection) {
      if (err) {
        next(err);
      } // not connected!

      // Use the connection
      connection.query(
        queryString,
        [name, isActive],
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) next(error);

          // Don't use the connection here, it has been returned to the pool.
          console.log("#results = ", results.length);
          res.status(200).json({
            statusCode: 200,
            results: results,
          });
          // dbconnection.end((err) => {
          //   console.log("pool was closed.");
          // });
        }
      );
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
            status: 404,
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
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    currentuserid = decoded.userId;
    console.log(currentuserid);

    let controle;
    let deletedeze;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.

        for (let i = 0; i < results.length; i++) {
          if (results[i].id == currentuserid) {
            controle = false;
            break;
          }
        }
        // Use the connection
        if (controle == false) {
          if (currentuserid == userId) {
            connection.query(
              "DELETE FROM user WHERE user.id = " + currentuserid + ";",
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
            res.status(403).json({
              status: 403,
              result: `geen toegang om deze te verwijderen`,
            });
          }
        } else {
          res.status(400).json({
            status: 400,
            result: `User with ID ${userId} not found!`,
          });
        }
      });
    });
  },
  updateUser: (req, res) => {
    const userId = req.params.userId;
    console.log(`user met ID ${userId} gezocht`);
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    currentuserid = decoded.userId;
    console.log(currentuserid);

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
          if (user.emailAdress !== undefined) {
            if (/^\d{10}$/.test(user.phoneNumber)) {
              if (currentuserid == userId) {
                connection.query(
                  "SELECT * FROM user WHERE id = " + userId + "",
                  function (error, results2, fields) {
                    console.log("opgehalde email" + results2[0].emailAdress);
                    console.log("opgegeven email:" + user.emailAdress);
                    for (let i = 0; i < results.length; i++) {
                      if (results2[0].emailAdress == user.emailAdress) {
                        controle2 = true;
                        break;
                      }
                      if (results[i].emailAdress == user.emailAdress) {
                        controle2 = false;
                        break;
                      }
                    }
                    if (controle2 == true) {
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
                      res.status(200).json({
                        status: 200,
                        result: `User with ID ${userId} succesfully changed`,
                      });
                    } else {
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
                  result: `your userid did not match`,
                });
              }
            } else {
              res.status(400).json({
                status: 400,
                result: `niet valide telefoonnummer`,
              });
            }
          } else {
            res.status(400).json({
              status: 400,
              result: `emailadress ontbreekt`,
            });
          }
        } else {
          res.status(400).json({
            status: 400,
            result: `User with ID ${userId} not found`,
          });
        }

        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
  userProfile: (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    currentuserid = decoded.userId;
    console.log(currentuserid);
    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM user", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
        let user = results.filter((item) => item.id == currentuserid);
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
            result: `User with ID ${currentuserid} not found`,
          };
        }
        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
};
module.exports = controller;
