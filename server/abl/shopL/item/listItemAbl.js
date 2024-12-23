const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function ListItemAbl(req, res) {
  try {
    req.body.id = req.sanitize(req.body.id);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { id } = req.body;

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

    const shoppingList = await shoppingListDao.get(req.db, objectId);
    if (!shoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${id} not found`,
      });
      return;
    }

    res.json({
      status: "success",
      itemList: shoppingList.itemList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListItemAbl;
