const express = require("express");
const router = express.Router();
const conditionalAuth = require("../middleware/conditionalAuth");

const CreateAbl = require("../abl/shopL/createAbl");
const GetAbl = require("../abl/shopL/getAbl");
const ListAbl = require("../abl/shopL/listAbl");
const UpdateAbl = require("../abl/shopL/updateAbl");
const DeleteAbl = require("../abl/shopL/deleteAbl");
const ArchiveAbl = require("../abl/shopL/archiveAbl");

const CreateItemAbl = require("../abl/shopL/item/createItemAbl");
const DeleteItemAbl = require("../abl/shopL/item/deleteItemAbl");
const StatusItemAbl = require("../abl/shopL/item/statusItemAbl");
const ListItemAbl = require("../abl/shopL/item/listItemAbl");
const UpdateItemAbl = require("../abl/shopL/item/updateItemAbl");

const AddMemberAbl = require("../abl/shopL/addMemberAbl");
const RemoveMemberAbl = require("../abl/shopL/removeMemberAbl");

router.post("/create", conditionalAuth, CreateAbl);
router.get("/get", conditionalAuth, GetAbl);
router.get("/list", conditionalAuth, ListAbl);
router.post("/update", conditionalAuth, UpdateAbl);
router.post("/delete", conditionalAuth, DeleteAbl);
router.post("/archive", conditionalAuth, ArchiveAbl);

router.post("/item/create", conditionalAuth, CreateItemAbl);
router.post("/item/delete", conditionalAuth, DeleteItemAbl);
router.post("/item/status", conditionalAuth, StatusItemAbl);
router.get("/item/list", conditionalAuth, ListItemAbl);
router.post("/item/update", conditionalAuth, UpdateItemAbl);

router.post("/addMember", conditionalAuth, AddMemberAbl);
router.post("/removeMember", conditionalAuth, RemoveMemberAbl);

module.exports = router;
