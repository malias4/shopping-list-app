const { ObjectId } = require("mongodb");

async function get(db, id) {
  try {
    return await db.collection("users").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw { code: "failedToGetUser", message: error.message };
  }
}

async function create(db, user) {
  try {
    const result = await db.collection("users").insertOne(user);
    return { ...user, _id: result.insertedId };
  } catch (error) {
    throw { code: "failedToCreateUser", message: error.message };
  }
}

async function update(db, user) {
  try {
    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(user._id) },
        { $set: { email: user.email, name: user.name } }
      );
    if (result.matchedCount === 0) {
      throw { code: "userNotFound", message: `User ${user._id} not found` };
    }
    return user;
  } catch (error) {
    throw { code: "failedToUpdateUser", message: error.message };
  }
}

async function remove(db, id) {
  try {
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    return {};
  } catch (error) {
    throw { code: "failedToRemoveUser", message: error.message };
  }
}

async function list(db) {
  try {
    return await db.collection("users").find().toArray();
  } catch (error) {
    throw { code: "failedToListUsers", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
