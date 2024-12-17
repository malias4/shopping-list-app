const express = require("express");
const router = express.Router();
const conditionalAuth = require("../middleware/conditionalAuth");

const CreateAbl = require("../abl/user/createAbl");
const DeleteAbl = require("../abl/user/deleteAbl");
const GetAbl = require("../abl/user/getAbl");
const ListAbl = require("../abl/user/listAbl");
const UpdateAbl = require("../abl/user/updateAbl");

const RegisterUserAbl = require("../abl/user/registerUserAbl");
const LoginUserAbl = require("../abl/user/loginUserAbl");

router.post("/create", conditionalAuth, CreateAbl);
router.post("/delete", conditionalAuth, DeleteAbl);
router.get("/get", conditionalAuth, GetAbl);
router.get("/list", conditionalAuth, ListAbl);
router.post("/update", conditionalAuth, UpdateAbl);

router.post("/register", RegisterUserAbl);
router.post("/login", LoginUserAbl);

module.exports = router;
