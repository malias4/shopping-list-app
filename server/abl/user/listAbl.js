const userDao = require("../../dao/user-dao.js");

async function ListUsersAbl(req, res) {
  try {
    const users = await userDao.list(req.db);
    res.json({
      status: "success",
      message: "Users retrieved successfully",
      users,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = ListUsersAbl;
