const Ajv = require("ajv");
const addFormats = require("ajv-formats");

const ajv = new Ajv();
addFormats(ajv);

const userDao = require("../../dao/user-dao.js");

const schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    name: { type: "string", maxLength: 100 },
  },
  required: ["email", "name"],
  additionalProperties: false,
};

async function CreateUserAbl(req, res) {
  try {
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

    const { email, name } = req.body;

    const userList = await userDao.list(req.db);

    const emailExists = userList.some((u) => u.email === email);
    if (emailExists) {
      res.status(400).json({
        code: "emailAlreadyExists",
        message: `User with email ${email} already exists`,
      });
      return;
    }

    const newUser = await userDao.create(req.db, { name, email });

    res.json({
      status: "success",
      message: "User created successfully",
      newUser,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = CreateUserAbl;
