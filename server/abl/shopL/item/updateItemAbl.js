const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    itemId: { type: "string" },
    itemName: { type: "string", maxLength: 200 },
  },
  required: ["listId", "itemId", "itemName"],
  additionalProperties: false,
};

async function UpdateItemAbl(req, res) {
  try {
    req.body.listId = req.sanitize(req.body.listId);
    req.body.itemId = req.sanitize(req.body.itemId);
    req.body.itemName = req.sanitize(req.body.itemName);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { listId, itemId, itemName } = req.body;

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

    if (
      shoppingList.ownerId !== userId &&
      !shoppingList.memberIdList.includes(userId)
    ) {
      res.status(403).json({
        code: "forbidden",
        message: "You do not have access to update items in this shopping list",
      });
      return;
    }

    const item = shoppingList.itemList.find((item) => item.id === itemId);
    if (!item) {
      res.status(404).json({
        code: "itemNotFound",
        message: `Item ${itemId} not found in shopping list ${listId}`,
      });
      return;
    }

    item.itemName = itemName;

    await shoppingListDao.update(req.db, shoppingList);

    res.json({
      status: "success",
      message: `Item ${itemId} updated to ${itemName} in shopping list ${listId}`,
      shoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateItemAbl;
