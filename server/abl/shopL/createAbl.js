const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    listName: { type: "string" },
  },
  required: ["listName"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    const { listName } = req.body;
    const userId = req.headers["x-user-id"];
    if (!userId) {
      res.status(400).json({
        code: "missingUserId",
        message: "User ID is required",
      });
      return;
    }

    const shoppingList = {
      listName,
      ownerId: userId,
      isArchived: false,
      memberIdList: [],
      itemList: [],
    };

    const result = await shoppingListDao.create(req.db, shoppingList);
    res.json({
      status: "success",
      message: "Shopping list created successfully",
      shoppingList: result,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateAbl;
