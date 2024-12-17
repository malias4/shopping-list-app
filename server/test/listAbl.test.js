const { MongoClient, ObjectId } = require("mongodb");
const ListAbl = require("../abl/shopL/listAbl");

let connection;
let db;

// Set up the database connection before all tests
beforeAll(async () => {
  const uri = "mongodb://localhost:27017";
  connection = await MongoClient.connect(uri);
  db = await connection.db("jest");
});

// Insert test data before each test
beforeEach(async () => {
  // Clear the collection before inserting test data
  await db.collection("shoppingLists").deleteMany({});
  // Insert test data
  await db.collection("shoppingLists").insertMany([
    {
      _id: new ObjectId("674b3f899ea7a953682fb779"),
      listName: "Picnic",
      isArchived: false,
      ownerId: "14515",
      memberIdList: ["14515"],
      itemList: [],
    },
    {
      _id: new ObjectId("674b3f899ea7a953682fb780"),
      listName: "Groceries",
      isArchived: false,
      ownerId: "14516",
      memberIdList: ["14515"],
      itemList: [],
    },
  ]);
});

// Clear the collection after each test
afterEach(async () => {
  await db.collection("shoppingLists").deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
  await connection.close();
});

describe("ListAbl Tests", () => {
  describe("Happy Path (Positive Scenarios)", () => {
    // Test for successfully retrieving shopping lists for the user
    it("should return shopping lists for the user", async () => {
      const req = {
        headers: { "x-user-id": "14515" },
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListAbl(req, res);

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Shopping lists retrieved successfully",
        authorizedLists: expect.any(Array),
      });
    });
  });

  describe("Alternative Scenarios (Error Handling)", () => {
    // Test for missing user ID in headers
    it("should return 400 if user ID is missing", async () => {
      const req = {
        headers: {},
        db,
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await ListAbl(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: "missingUserId",
        message: "User ID is required",
      });
    });
  });
});
