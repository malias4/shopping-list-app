const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
  },
  required: ["listId"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
  try {
    req.body.listId = req.sanitize(req.body.listId);

    const reqParams = req.body;

    const valid = ajv.validate(schema, reqParams);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const userId = req.headers["x-user-id"];
    if (!userId) {
      res.status(400).json({
        code: "missingUserId",
        message: "User ID is required",
      });
      return;
    }

    let objectId;
    try {
      objectId = new ObjectId(reqParams.listId);
    } catch (e) {
      res.status(400).json({
        code: "invalidObjectId",
        message: `Invalid ObjectId: ${reqParams.listId}`,
      });
      return;
    }

    const shoppingList = await shoppingListDao.get(req.db, objectId);
    if (!shoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${reqParams.listId} not found`,
      });
      return;
    }

    if (shoppingList.ownerId !== userId) {
      res.status(403).json({
        code: "forbidden",
        message: "Only the owner can delete this shopping list",
      });
      return;
    }

    await shoppingListDao.remove(req.db, objectId);

    res.json({
      status: "success",
      message: `Shopping list ${reqParams.listId} deleted`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteAbl;