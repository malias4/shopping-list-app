const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    isArchived: { type: "boolean" },
  },
  required: ["id", "isArchived"],
  additionalProperties: false,
};

async function ArchiveAbl(req, res) {
  try {
    req.body.id = req.sanitize(req.body.id);
    req.body.isArchived = req.sanitize(req.body.isArchived);

    req.body.isArchived =
      req.body.isArchived === "true" || req.body.isArchived === true;

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { id, isArchived } = req.body;
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

    const shoppingList = await shoppingListDao.get(req.db, objectId);
    if (!shoppingList) {
      res.status(404).json({
        code: "shoppingListNotFound",
        message: `Shopping list ${id} not found`,
      });
      return;
    }

    if (shoppingList.ownerId !== userId) {
      res.status(403).json({
        code: "forbidden",
        message: "Only the owner can archive this shopping list",
      });
      return;
    }

    shoppingList.isArchived = isArchived;

    await shoppingListDao.update(req.db, shoppingList);

    res.json({
      status: "success",
      message: `Shopping list ${id} archived status updated successfully`,
      shoppingList,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ArchiveAbl;
