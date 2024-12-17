const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const bcrypt = require("bcryptjs");
const userDao = require("../../dao/user-dao.js");

const ajv = new Ajv();
addFormats(ajv);

const schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    name: { type: "string", maxLength: 100 },
    password: { type: "string", minLength: 6 },
  },
  required: ["email", "name", "password"],
  additionalProperties: false,
};

async function RegisterUserAbl(req, res) {
  try {
    req.body.email = req.sanitize(req.body.email);
    req.body.name = req.sanitize(req.body.name);
    req.body.password = req.sanitize(req.body.password);

    const valid = ajv.validate(schema, req.body);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const { email, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      name,
      password: hashedPassword,
    };

    const createdUser = await userDao.create(req.db, newUser);

    res.json({
      status: "success",
      message: "User registered successfully",
      createdUser,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = RegisterUserAbl;
