const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    itemId: { type: "string" },
    itemName: { type: "string" },
  },
  required: ["listId", "itemId", "itemName"],
  additionalProperties: false,
};

async function UpdateItemAbl(req, res) {
  try {
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

    const shoppingList = await shoppingListDao.get(
      req.db,
      new ObjectId(listId)
    );
    if (!shoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${listId} not found`,
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

    shoppingList.itemList[itemIndex].itemName = itemName;
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
