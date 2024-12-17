const { MongoClient, ObjectId } = require("mongodb");
const ArchiveAbl = require("../abl/shopL/archiveAbl");

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

describe("ArchiveAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully archiving a shopping list
    it("should archive a shopping list", async () => {
      // Insert test data
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: "14515",
        memberIdList: [],
        itemList: [],
      });

      const req = {
        body: { id: "674b3f899ea7a953682fb779", isArchived: true },
        headers: { "x-user-id": "14515" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message:
          "Shopping list 674b3f899ea7a953682fb779 archived status updated successfully",
        shoppingList: expect.any(Object),
      });
    });
  });

  describe("Alternative Scenarios (Error Handling)", () => {
    // Test for shopping list not found
    it("should return 404 if shopping list is not found", async () => {
      const req = {
        body: { id: new ObjectId().toString(), isArchived: true },
        headers: { "x-user-id": "14515" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "shoppingListNotFound",
        message: `Shopping list ${req.body.id} not found`,
      });
    });

    // Test for user not having access
    it("should return 403 if user does not have access", async () => {
      // Insert test data
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: "14515",
        memberIdList: [],
        itemList: [],
      });

      const req = {
        body: { id: "674b3f899ea7a953682fb779", isArchived: true },
        headers: { "x-user-id": "invalid_user_id" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        code: "forbidden",
        message: "Only the owner can archive this shopping list",
      });
    });

    // Test for invalid ObjectId
    it("should return 400 for invalid ObjectId", async () => {
      const req = {
        body: { id: "invalid_id", isArchived: true },
        headers: { "x-user-id": "14515" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "invalidObjectId",
        message: "Invalid ObjectId: invalid_id",
      });
    });

    // Test for missing listId in request body
    it("should return 400 if listId is missing", async () => {
      const req = {
        body: { isArchived: true },
        headers: { "x-user-id": "14515" },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

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
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: "14515",
        memberIdList: [],
        itemList: [],
      });

      const req = {
        body: { id: "674b3f899ea7a953682fb779", isArchived: true },
        headers: {},
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ArchiveAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "missingUserId",
        message: "User ID is required",
      });
    });
  });
});
