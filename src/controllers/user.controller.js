let database = [];
let id = 0;

let controller = {
  addUser: (req, res) => {
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
