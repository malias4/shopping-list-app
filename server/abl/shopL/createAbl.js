const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listName: { type: "string", maxLength: 200 },
  },
  required: ["listName"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
  try {
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

    const { listName } = req.body;
    const ownerId = req.headers["x-user-id"];

    if (!ownerId) {
      res.status(400).json({
        code: "missingOwnerId",
        message: "Owner ID is required",
      });
      return;
    }

    const newShoppingList = {
      _id: new ObjectId(),
      listName: listName,
      isArchived: false,
      ownerId,
      memberIdList: [],
      itemList: [],
    };

    const createdShoppingList = await shoppingListDao.create(
      req.db,
      newShoppingList
    );

    res.json({
      status: "success",
      message: "Shopping list created successfully",
      createdShoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
