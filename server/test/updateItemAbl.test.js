const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const UpdateItemAbl = require("../abl/shopL/item/updateItemAbl");

let connection;
let db;

// Set up the database connection before all tests
beforeAll(async () => {
  const uri = "mongodb://localhost:27017";
  connection = await MongoClient.connect(uri);
  db = await connection.db("jest");
});

// Clear the collection before each test
beforeEach(async () => {
  await db.collection("shoppingLists").deleteMany({});
});

// Clear the collection after each test
afterEach(async () => {
  await db.collection("shoppingLists").deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await connection.close();
});

describe("UpdateItemAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully updating an item in a shopping list
    it("should update an item in a shopping list", async () => {
      // Insert test data
      const ownerId = new ObjectId();
      const itemId = crypto.randomBytes(16).toString("hex");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [],
        itemList: [{ id: itemId, itemName: "Sandwiches", isResolved: false }],
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", itemId, itemName: "Salad" },
        headers: { "x-user-id": ownerId.toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: `Item ${itemId} updated to Salad in shopping list 674b3f899ea7a953682fb779`,
        shoppingList: expect.any(Object),
      });
    });
  });

  describe("Alternative Scenarios (Error Handling)", () => {
    // Test for shopping list not found
    it("should return 404 if shopping list is not found", async () => {
      const req = {
        body: {
          listId: new ObjectId().toString(),
          itemId: crypto.randomBytes(16).toString("hex"),
          itemName: "Salad",
        },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "shoppingListNotFound",
        message: expect.stringContaining("Shopping list"),
      });
    });

    // Test for user not having access
    it("should return 403 if user does not have access", async () => {
      // Insert test data
      const ownerId = new ObjectId();
      const itemId = crypto.randomBytes(16).toString("hex");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [],
        itemList: [{ id: itemId, itemName: "Sandwiches", isResolved: false }],
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", itemId, itemName: "Salad" },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        code: "forbidden",
        message: "You do not have access to update items in this shopping list",
      });
    });

    // Test for invalid ObjectId
    it("should return 400 for invalid ObjectId", async () => {
      const req = {
        body: {
          listId: "invalid_id",
          itemId: crypto.randomBytes(16).toString("hex"),
          itemName: "Salad",
        },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "invalidObjectId",
        message: "Invalid ObjectId: invalid_id",
      });
    });

    // Test for missing listId in request body
    it("should return 400 if listId is missing", async () => {
      const req = {
        body: {
          itemId: crypto.randomBytes(16).toString("hex"),
          itemName: "Salad",
        },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: expect.any(Array),
      });
    });

    // Test for missing x-user-id header
    it("should return 400 if x-user-id header is missing", async () => {
      // Insert test data
      const ownerId = new ObjectId();
      const itemId = crypto.randomBytes(16).toString("hex");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [],
        itemList: [{ id: itemId, itemName: "Sandwiches", isResolved: false }],
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", itemId, itemName: "Salad" },
        headers: {},
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await UpdateItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "missingUserId",
        message: "User ID is required",
      });
    });
  });
});
