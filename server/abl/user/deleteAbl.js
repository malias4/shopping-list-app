const Ajv = require("ajv");
const ajv = new Ajv();

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteUserAbl(req, res) {
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

    const user = await userDao.get(req.db, id);
    if (!user) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${id} not found`,
      });
      return;
    }

    await userDao.remove(req.db, id);

    res.json({
      status: "success",
      message: `User ${id} deleted successfully`,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = DeleteUserAbl;
