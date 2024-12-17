const { MongoClient, ObjectId } = require("mongodb");
const CreateAbl = require("../abl/shopL/createAbl");

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

describe("CreateAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully creating a new shopping list
    it("should create a new shopping list", async () => {
      const req = {
        body: { listName: "New List" },
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await CreateAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Shopping list created successfully",
        createdShoppingList: expect.any(Object),
      });
    });
  });

  describe("Alternative Scenarios (Error Handling)", () => {
    // Test for missing listName in request body
    it("should return 400 if listName is missing", async () => {
      const req = {
        body: {},
        headers: { "x-user-id": new ObjectId().toString() },
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await CreateAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "dtoInIsNotValid",
        message: "dtoIn is not valid",
        validationError: expect.any(Array),
      });
    });

    // Test for missing ownerId in headers
    it("should return 400 if ownerId is missing", async () => {
      const req = {
        body: { listName: "New List" },
        headers: {},
        sanitize: (value) => value,
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await CreateAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "missingOwnerId",
        message: "Owner ID is required",
      });
    });
  });
});
