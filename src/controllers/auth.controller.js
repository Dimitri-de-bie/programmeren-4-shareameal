const assert = require("assert");
const jwt = require("jsonwebtoken");
const dbconnection = require("../../database");
const logger = require("../config/config").logger;
const jwtSecretKey = require("../config/config").jwtSecretKey;

let controller = {
  login(req, res, next) {
    let emailcheck = false;
    let passwordcheck = false;
    dbconnection.getConnection((err, connection) => {
      if (err) {
        logger.error("Error getting connection from dbconnection");
        res.status(500).json({
          error: err.toString(),
          datetime: new Date().toISOString(),
        });
      }
      //The personal_info part contains the following ASCII characters.
      // Uppercase (A-Z) and lowercase (a-z) English letters.
      // Digits (0-9).
      // Characters ! # $ % & ' * + - / = ? ^ _ ` { | } ~
      // Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other.
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          req.body.emailAdress
        )
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
      if (connection) {
        // 1. Kijk of deze useraccount bestaat.
        connection.query(
          "SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?",
          [req.body.emailAdress],
          (err, rows, fields) => {
            connection.release();
            if (err) {
              logger.error("Error: ", err.toString());
              res.status(500).json({
                error: err.toString(),
                datetime: new Date().toISOString(),
              });
            }
            if (rows && emailcheck == true && passwordcheck == true) {
              console.log(emailcheck);
              // 2. Er was een resultaat, check het password.
              if (
                rows &&
                rows.length === 1 &&
                rows[0].password == req.body.password
              ) {
                logger.info(
                  "passwords DID match, sending userinfo and valid token"
                );
                // Extract the password from the userdata - we do not send that in the response.
                const { password, ...userinfo } = rows[0];
                // Create an object containing the data we want in the payload.
                const payload = {
                  userId: userinfo.id,
                };

                jwt.sign(
                  payload,
                  jwtSecretKey,
                  { expiresIn: "12d" },
                  function (err, token) {
                    logger.debug("User logged in, sending: ", userinfo);
                    res.status(200).json({
                      statusCode: 200,
                      results: { ...userinfo, token },
                    });
                  }
                );
              } else {
                logger.info("User not found or password invalid");
                res.status(404).json({
                  status: 404,
                  message: "User not found or password invalid",
                  datetime: new Date().toISOString(),
                });
              }
            }
          }
        );
      }
    });
  },

  //
  //
  //
  validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
      assert(
        typeof req.body.emailAdress === "string",
        "email must be a string."
      );
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      next();
    } catch (ex) {
      res.status(400).json({
        status: 400,
        error: ex.toString(),
        datetime: new Date().toISOString(),
      });
    }
  },

  //
  //
  //
  validateToken(req, res, next) {
    logger.info("validateToken called");
    // logger.trace(req.headers)
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      logger.warn("Authorization header missing!");
      res.status(401).json({
        status: 401,
        error: "Authorization header missing!",
        datetime: new Date().toISOString(),
      });
    } else {
      // Strip the word 'Bearer ' from the headervalue
      const token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          logger.warn("Not authorized");
          res.status(401).json({
            status: 401,
            error: "Not authorized",
            datetime: new Date().toISOString(),
          });
        }
        if (payload) {
          logger.debug("token is valid", payload);
          // User heeft toegang. Voeg UserId uit payload toe aan
          // request, voor ieder volgend endpoint.
          req.userId = payload.userId;
          next();
        }
      });
    }
  },
};

module.exports = controller;
