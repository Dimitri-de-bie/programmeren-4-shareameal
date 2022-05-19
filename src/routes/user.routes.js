const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

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
router.post("/api/user", userController.validateUser, userController.addUser);
//personal user ophalen
router.get("/api/user/profile", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "deze funtionaliteit is nog niet geraliseerd",
  });
});
//specifieke user ophalen
router.get(
  "/api/user/:userId",
  authController.validateToken,
  userController.getUserById
);

//specifieke user updaten
router.post(
  "/api/user/:userId",
  authController.validateToken,
  userController.updateUser
);

//specifieke user deleten
router.delete(
  "/api/user/:userId",
  authController.validateToken,
  userController.deleteUser
);
//alle users ophalen
router.get(
  "/api/user",
  authController.validateToken,
  userController.getAllUsers
);

module.exports = router;
