const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    itemId: { type: "string" },
  },
  required: ["listId", "itemId"],
  additionalProperties: false,
};

async function DeleteItemAbl(req, res) {
  try {
    req.body.listId = req.sanitize(req.body.listId);
    req.body.itemId = req.sanitize(req.body.itemId);

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

    const { listId, itemId } = req.body;

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
        message: "You do not have access to delete items in this shopping list",
      });
      return;
    }

    const itemIndex = shoppingList.itemList.findIndex(
      (item) => item.id === itemId
    );
    if (itemIndex === -1) {
      res.status(404).json({
        code: "itemNotFound",
        message: `Item ${itemId} not found in shopping list ${listId}`,
      });
      return;
    }

    shoppingList.itemList.splice(itemIndex, 1);

    await shoppingListDao.update(req.db, shoppingList);

    res.json({
      status: "success",
      message: `Item ${itemId} deleted from shopping list ${listId}`,
      shoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteItemAbl;
