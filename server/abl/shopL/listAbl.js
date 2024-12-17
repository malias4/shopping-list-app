const Ajv = require("ajv");
const { ObjectId } = require("mongodb");
const ajv = new Ajv();

const shoppingListDao = require("../../dao/shoppingList-dao.js");

async function ListAbl(req, res) {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) {
      res.status(400).json({
        code: "missingUserId",
        message: "User ID is required",
      });
      return;
    }

    const shoppingLists = await shoppingListDao.list(req.db);

    const authorizedLists = shoppingLists.filter(
      (list) => list.ownerId === userId || list.memberIdList.includes(userId)
    );

    res.json({
      status: "success",
      message: "Shopping lists retrieved successfully",
      authorizedLists,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListAbl;
