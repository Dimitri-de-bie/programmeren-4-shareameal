const assert = require("assert");
const jwt = require("jsonwebtoken");
const { DATETIME, DATETIME2 } = require("mysql/lib/protocol/constants/types");
const dbconnection = require("../../database");
const logger = require("../config/config").logger;
const jwtSecretKey = require("../config/config").jwtSecretKey;
let database = [];

let controller = {
  validatemeal: (req, res, next) => {
    let meal = req.body;
    let {
      isVega,
      isVegan,
      isToTakeHome,
      dateTime,
      maxAmountOfParticipants,
      price,
      imageUrl,
      name,
      description,
      allergenes,
    } = meal;
    try {
      assert(typeof isVega === "number", "isVega must be a int");
      assert(typeof isVegan === "number", "isVegan must be a int");
      assert(typeof isToTakeHome === "number", "isToTakeHome must be a int");
      assert(typeof dateTime === "string", "dateTime must be a string");
      assert(
        typeof maxAmountOfParticipants === "number",
        "maxAmountOfParticipants must be a int"
      );
      assert(typeof price === "number", "price must be a double");
      assert(typeof imageUrl === "string", "imageUrl must be a string");
      assert(typeof name === "string", "name must be a string");
      assert(typeof description === "string", "description must be a string");
      assert(typeof allergenes === "string", "allergenes must be a string");
      next();
    } catch (err) {
      const error = {
        status: 400,
        result: err.message,
      };
      next(error);
    }
  },
  addMeal: (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    currentuserid = decoded.userId;
    console.log(currentuserid);
    let meal = req.body;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM meal", function (error, results, fields) {
        // When done with the connection, release it.

        // Handle error after the release.
        if (error) throw error;
        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
        connection.query(
          "SELECT MAX(id) as maxid FROM meal;",
          function (error, results2, fields) {
            id = results2[0].maxid + 1;
            meal = {
              id,
              ...meal,
            };
            console.log(meal);
            console.log(
              new Date().toISOString().slice(0, 19).replace("T", " ")
            );
            console.log(results2[0].maxid);
            connection.query(
              "INSERT INTO `meal` (`id`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`,`dateTime`, `maxAmountOfParticipants`, `price`, `imageUrl`, `cookId`,`createDate`, `name`, `description`, `allergenes`) VALUES('" +
                id +
                "','1','" +
                meal.isVega +
                "','" +
                meal.isVegan +
                "','" +
                meal.isToTakeHome +
                "','" +
                meal.dateTime +
                "','" +
                meal.maxAmountOfParticipants +
                "'," +
                meal.price +
                ",'" +
                meal.imageUrl +
                "','" +
                currentuserid +
                "','" +
                new Date().toISOString().slice(0, 19).replace("T", " ") +
                "','" +
                meal.name +
                "','" +
                meal.description +
                "','" +
                meal.allergenes +
                "')"
            );
            res.status(201).json({
              status: 201,
              result: "meal has been succesfully added",
            });
            connection.release();
          }
        );
      });
    });
  },

  getAllmeals: (req, res, next) => {
    let { name, isActive } = req.query;
    console.log(`name = ${name} isActive = ${isActive}`);

    let queryString = "SELECT * FROM `meal`";
    if (name || isActive) {
      queryString += " WHERE ";
      if (name) {
        queryString += `name LIKE ?`;
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
        function (error, result, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) next(error);

          // Don't use the connection here, it has been returned to the pool.
          console.log("#result = ", result.length);
          res.status(200).json({
            status: 200,
            result: result,
          });
          // dbconnection.end((err) => {
          //   console.log("pool was closed.");
          // });
        }
      );
    });
  },

  getMealById: (req, res, next) => {
    const mealId = req.params.mealId;
    console.log(`meal met ID ${mealId} gezocht`);

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query("SELECT * FROM meal", function (error, results, fields) {
        // When done with the connection, release it.
        connection.release();
        let meal = results.filter((item) => item.id == mealId);
        // Handle error after the release.
        if (error) throw error;

        // Don't use the connection here, it has been returned to the pool.
        console.log("#results = ", results.length);
        if (meal.length > 0) {
          console.log(meal);
          res.status(200).json({
            status: 200,
            result: meal,
          });
        } else {
          const error = {
            status: 404,
            result: `meal with ID ${mealId} not found`,
          };
          next(error);
        }
        // dbconnection.end((err) => {
        //   console.log("pool was closed.");
        // });
      });
    });
  },
  deleteMeal: (req, res) => {
    const mealid = req.params.mealid;
    console.log(`meal met ID ${mealid} gezocht`);
    const authHeader = req.headers.authorization;
    const token = authHeader.substring(7, authHeader.length);
    var decoded = jwt.verify(token, jwtSecretKey);

    currentuserid = decoded.userId;
    console.log(currentuserid);

    let controle;
    let deletedeze;

    dbconnection.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      connection.query("SELECT * FROM meal", function (error, results, fields) {
        // When done with the connection, release it.
        for (let i = 0; i < results.length; i++) {
          if (results[i].id == mealid) {
            controle = false;
            deletedeze = i;

            break;
          }
        }

        // Use the connection
        if (controle == false) {
          if (results[deletedeze].cookId == currentuserid) {
            connection.query(
              "DELETE FROM meal WHERE meal.id = " + mealid + ";",
              function (error, results, fields) {
                // When done with the connection, release it.
                // Handle error after the release.
                if (error) throw error;

                // Don't use the connection here, it has been returned to the pool.
                console.log("#results = ", results.length);
                res.status(200).json({
                  status: 200,
                  result: `meal with ID ${mealid} has been deleted!`,
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
          res.status(404).json({
            status: 404,
            result: `meal with ID ${mealid} not found!`,
          });
        }
      });
    });
  },
};
module.exports = controller;
