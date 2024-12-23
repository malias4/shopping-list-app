const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    userId: { type: "string" },
  },
  required: ["listId", "userId"],
  additionalProperties: false,
};

async function AddMemberAbl(req, res) {
  try {
    req.body.listId = req.sanitize(req.body.listId);
    req.body.userId = req.sanitize(req.body.userId);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { listId, userId } = req.body;
    const requesterId = req.headers["x-user-id"];
    if (!requesterId) {
      res.status(400).json({
        code: "missingUserId",
        message: "User ID is required",
      });
      return;
    }

    let objectId;
    try {
      objectId = new ObjectId(listId);
    } catch (e) {
      res.status(400).json({
        code: "invalidObjectId",
        message: `Invalid ObjectId: ${listId}`,
      });
      return;
    }

    const shoppingList = await shoppingListDao.get(req.db, objectId);
    if (!shoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${listId} not found`,
      });
      return;
    }

    // Remove user validation logic
    if (!shoppingList.memberIdList.includes(userId)) {
      shoppingList.memberIdList.push(userId);
      await shoppingListDao.update(req.db, shoppingList);
    }

    res.json({
      status: "success",
      message: `User ${userId} added to shopping list ${listId} successfully`,
      shoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = AddMemberAbl;
