const { ObjectId } = require("mongodb");

async function get(db, id) {
  try {
    return await db
      .collection("shoppingLists")
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw { code: "failedToGetShoppingList", message: error.message };
  }
}

async function create(db, shoppingList) {
  try {
    const result = await db.collection("shoppingLists").insertOne(shoppingList);
    return { ...shoppingList, _id: result.insertedId };
  } catch (error) {
    throw { code: "failedToCreateShoppingList", message: error.message };
  }
}

async function update(db, shoppingList) {
  try {
    const result = await db
      .collection("shoppingLists")
      .findOneAndUpdate(
        { _id: new ObjectId(shoppingList._id) },
        { $set: shoppingList },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw { code: "failedToUpdateShoppingList", message: error.message };
  }
}

async function remove(db, id) {
  try {
    await db.collection("shoppingLists").deleteOne({ _id: new ObjectId(id) });
    return {};
  } catch (error) {
    throw { code: "failedToRemoveShoppingList", message: error.message };
  }
}

async function list(db) {
  try {
    return await db.collection("shoppingLists").find().toArray();
  } catch (error) {
    throw { code: "failedToListShoppingLists", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
