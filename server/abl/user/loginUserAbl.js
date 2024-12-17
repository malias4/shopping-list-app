const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userDao = require("../../dao/user-dao.js");

const ajv = new Ajv();
addFormats(ajv);

const secretKey = process.env.JWT_SECRET || "a_really_secret_key";

const schema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

async function LoginUserAbl(req, res) {
  try {
    req.body.email = req.sanitize(req.body.email);
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

    const { email, password } = req.body;

    const user = await userDao.getByEmail(req.db, email);
    if (!user) {
      res.status(400).json({
        code: "invalidCredentials",
        message: "Invalid email or password",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        code: "invalidCredentials",
        message: "Invalid email or password",
      });
      return;
    }

    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    res.json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = LoginUserAbl;
