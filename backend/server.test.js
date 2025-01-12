// server.test.js
const request = require("supertest");
const app = require("./server"); // Import your Express app

describe("POST /api/login", () => {
  it("should return a token when valid credentials are provided", async () => {
    const response = await request(app).post("/api/login").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.status).toBe(200); // Check if status code is 200
    expect(response.body.token).toBe("fake-jwt-token"); // Validate token in the response
  });

  it("should return an error when invalid credentials are provided", async () => {
    const response = await request(app).post("/api/login").send({
      username: "wrongUser",
      password: "wrongPassword",
    });

    expect(response.status).toBe(400); // Expect a 400 status code
    expect(response.body.message).toBe("Invalid credentials"); // Validate the error message
  });
  it("should return an error when username or password is missing", async () => {
    const response = await request(app).post("/api/login").send({
      username: "testUser",
    });

    expect(response.status).toBe(400); // Missing password
    expect(response.body.message).toBe("Invalid credentials");
  });
});
