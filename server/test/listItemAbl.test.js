const { MongoClient, ObjectId } = require("mongodb");
const ListItemAbl = require("../abl/shopL/item/listItemAbl");
const crypto = require("crypto");

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

describe("ListItemAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully listing items in a shopping list
    it("should list items in a shopping list", async () => {
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
        body: { id: "674b3f899ea7a953682fb779" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListItemAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        itemList: expect.any(Array),
      });
    });
  });

  describe("Alternative Scenarios (Error Handling)", () => {
    // Test for shopping list not found
    it("should return 404 if shopping list is not found", async () => {
      const req = {
        body: { id: new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "shoppingListNotFound",
        message: expect.stringContaining("Shopping list"),
      });
    });

    // Test for invalid ObjectId
    it("should return 400 for invalid ObjectId", async () => {
      const req = {
        body: { id: "invalid_id" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "invalidObjectId",
        message: "Invalid ObjectId: invalid_id",
      });
    });

    // Test for missing id in request body
    it("should return 400 if id is missing", async () => {
      const req = {
        body: {},
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListItemAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: expect.any(Array),
      });
    });
  });
});
