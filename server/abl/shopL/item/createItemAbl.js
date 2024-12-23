const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const ajv = new Ajv();

const shoppingListDao = require("../../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listId: { type: "string" },
    itemName: { type: "string", maxLength: 200 },
  },
  required: ["listId"],
  additionalProperties: false,
};

async function CreateItemAbl(req, res) {
  try {
    req.body.listId = req.sanitize(req.body.listId);
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

    const { listId, itemName } = req.body;

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
        message: "You do not have access to add items to this shopping list",
      });
      return;
    }

    const newItem = {
      id: crypto.randomBytes(16).toString("hex"),
      itemName,
      isResolved: false,
    };

    shoppingList.itemList.push(newItem);

    await shoppingListDao.update(req.db, shoppingList);

    res.json({
      status: "success",
      message: `Item ${newItem.id} added successfully to shopping list ${listId}`,
      shoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateItemAbl;
