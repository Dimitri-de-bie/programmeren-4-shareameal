const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

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
router.post("/api/user", userController.addUser);

//specifieke user ophalen
router.get("/api/user/:userId", userController.getUserById);

//specifieke user updaten
router.post("/api/user/:userId", userController.updateUser);

//specifieke user deleten
router.delete("/api/user/:userId", userController.deleteUser);
//alle users ophalen
router.get("/api/user", userController.getAllUsers);
//personal user ophalen
router.get("/api/personaluser", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "deze funtionaliteit is nog niet geraliseerd",
  });
});

module.exports = router;
