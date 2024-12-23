const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    listName: { type: "string", maxLength: 200 },
  },
  required: ["id", "listName"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    req.body.id = req.sanitize(req.body.id);
    req.body.listName = req.sanitize(req.body.listName);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { id, listName } = req.body;

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
      objectId = new ObjectId(id);
    } catch (e) {
      res.status(400).json({
        code: "invalidObjectId",
        message: `Invalid ObjectId: ${id}`,
      });
      return;
    }

    const existingShoppingList = await shoppingListDao.get(req.db, objectId);
    if (!existingShoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${id} not found`,
      });
      return;
    }

    if (existingShoppingList.ownerId !== userId) {
      res.status(403).json({
        code: "forbidden",
        message: "Only the owner can update the name of this shopping list",
      });
      return;
    }

    existingShoppingList.listName = listName;

    await shoppingListDao.update(req.db, existingShoppingList);

    const updatedShoppingList = await shoppingListDao.get(req.db, objectId);

    res.json({
      status: "success",
      message: `Shopping list ${id} updated successfully`,
      shoppingList: updatedShoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateAbl;
