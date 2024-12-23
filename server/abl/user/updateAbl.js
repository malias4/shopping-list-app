const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    email: { type: "string", format: "email" },
    name: { type: "string", maxLength: 100 },
  },
  required: ["id", "email", "name"],
  additionalProperties: false,
};

async function UpdateUserAbl(req, res) {
  try {
    req.body.id = req.sanitize(req.body.id);
    req.body.email = req.sanitize(req.body.email);
    req.body.name = req.sanitize(req.body.name);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { id, email, name } = req.body;

    const existingUser = await userDao.get(req.db, id);
    if (!existingUser) {
      res.status(404).json({
        code: "userNotFound",
        message: `User ${id} not found`,
      });
      return;
    }

    const userList = await userDao.list(req.db);
    const emailExists = userList.some(
      (u) => u.email === email && u._id.toString() !== id
    );
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${email} already exists`,
      });
      return;
    }

    existingUser.email = email;
    existingUser.name = name;

    const updatedUser = await userDao.update(req.db, existingUser);

    res.json({
      status: "success",
      message: `User ${id} updated successfully`,
      updatedUser,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = UpdateUserAbl;
