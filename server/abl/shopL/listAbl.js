const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

async function ListAbl(req, res) {
  try {
    const shoppingLists = await shoppingListDao.list(req.db);

    res.json({
      status: "success",
      message: "Shopping lists retrieved successfully",
      shoppingLists,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
