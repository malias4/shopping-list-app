const { MongoClient, ObjectId } = require("mongodb");
const RemoveMemberAbl = require("../abl/shopL/removeMemberAbl");

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
  await db.collection("users").deleteMany({});
});

// Clear the collection after each test
afterEach(async () => {
  await db.collection("shoppingLists").deleteMany({});
  await db.collection("users").deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await connection.close();
});

describe("RemoveMemberAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully removing a member from a shopping list
    it("should remove a member from a shopping list", async () => {
      // Insert test data
      const ownerId = new ObjectId();
      const userId = new ObjectId("674b484fd567594f2ee4a5b6");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [userId.toString()],
        itemList: [],
      });
      await db.collection("users").insertOne({
        _id: userId,
        name: "John Doe",
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", userId: userId.toString() },
        headers: { "x-user-id": ownerId.toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: `User ${userId.toString()} removed from shopping list 674b3f899ea7a953682fb779 successfully`,
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
          userId: new ObjectId().toString(),
        },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: "shoppingListNotFound",
        message: `Shopping list ${req.body.listId} not found`,
      });
    });

    // Test for user not having access
    it("should return 403 if user does not have access", async () => {
      // Insert test data
      const ownerId = new ObjectId();
      const userId = new ObjectId("674b484fd567594f2ee4a5b6");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [userId.toString()],
        itemList: [],
      });
      await db.collection("users").insertOne({
        _id: userId,
        name: "John Doe",
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", userId: userId.toString() },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        code: "forbidden",
        message: "Only the owner can remove members from this shopping list",
      });
    });

    // Test for invalid ObjectId
    it("should return 400 for invalid ObjectId", async () => {
      const req = {
        body: { listId: "invalid_id", userId: new ObjectId().toString() },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "invalidObjectId",
        message: "Invalid ObjectId: invalid_id",
      });
    });

    // Test for missing listId in request body
    it("should return 400 if listId is missing", async () => {
      const req = {
        body: { userId: new ObjectId().toString() },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

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
      const userId = new ObjectId("674b484fd567594f2ee4a5b6");
      await db.collection("shoppingLists").insertOne({
        _id: new ObjectId("674b3f899ea7a953682fb779"),
        listName: "Picnic",
        isArchived: false,
        ownerId: ownerId.toString(),
        memberIdList: [userId.toString()],
        itemList: [],
      });
      await db.collection("users").insertOne({
        _id: userId,
        name: "John Doe",
      });

      const req = {
        body: { listId: "674b3f899ea7a953682fb779", userId: userId.toString() },
        headers: {},
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await RemoveMemberAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "missingUserId",
        message: "User ID is required",
      });
    });
  });
});
