import request from 'supertest';
import app from './taskRoutes.js';

describe("POST Input Todo", () => {
  test("insert", async () => {
    const response = await request(app).post("/todos/").send({
      user_id: "3WmaSwjxWoUonQ8QRkl48w5wW753",
      description: "Test Input"
    });
    expect(response.statusCode).toBe(200);
  });
});