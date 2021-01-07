const dotenv = require('dotenv');

dotenv.config();

const { Pool } = require("pg");
const supertest = require("supertest");

const app = require("../src/app");

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

beforeAll(async () => {
  await db.query("DELETE FROM genres;");
  await db.query("DELETE FROM recommendations;");
});

afterAll(async () => {
  await db.end();
  
});

describe("POST /genres", () => {

    it("Should return 422 if name params is not a string", async () => {
        const body = {
            "name": 123
        };

        const response = await agent.post('/genres').send(body);

        expect(response.status).toBe(422);

    });

    it("Should return 409 if genre params already exists", async () => {

        await db.query("INSERT INTO genres (name) values ($1);", ["Axé"]);

        const body = {
            "name": "Axé"
        };

        const response = await agent.post('/genres').send(body);

        expect(response.status).toBe(409);

    });

    it("Should return 201 and create a new genre", async () => {

        const body = {
            "name": "Rock"
        };

        const response = await agent.post('/genres').send(body);

        expect(response.status).toBe(201);

    });
})

describe("GET /genres", () => {
    it('Should return 200 with list of genres', async () => {

        await db.query("INSERT INTO genres (name) values ($1);", ["Pagode"]);
        await db.query("INSERT INTO genres (name) values ($1);", ["Sertanejo"]);
        await db.query("INSERT INTO genres (name) values ($1);", ["Emo"]);

        const response = await agent.get("/genres");
        const allGenres = response.body;

        expect(response.status).toBe(200);
        expect(allGenres).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    "name": "Pagode"
                }),
                expect.objectContaining({
                    "name": "Sertanejo"
                }),
                expect.objectContaining({
                    "name": "Emo"
                }),
            ])
        );
    });
});