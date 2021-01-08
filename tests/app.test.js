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
 
  await db.query("ALTER SEQUENCE recommendations_id_seq RESTART WITH 1;");
  await db.query("ALTER SEQUENCE genres_id_seq RESTART WITH 1;");
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

describe("POST /recommendations", () => {

    it("Should return 422 if name params is not a string", async () => {
        const body = {
            name: 123,
            genresIds: [32, 23],
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);

    });

    it("Should return 422 if genresIds is not an array", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            genresIds: 32,
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);

    });

    it("Should return 422 if genresIds is not an array of integer", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            genresIds: ['lala', 'lolo'],
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);

    });

    it("Should return 422 if youtubeLink is not a youtube's link", async () => {
        const body = {
            name: "Falamansa - Xote dos Milagres",
            genresIds: [32, 23],
            youtubeLink: "https://www.google.com",
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(422);

    });

    it("Should return 404 if any id does not exist", async () => {
        
        const body = {
            name: "Falamansa - Xote dos Milagres",
            genresIds: [1800, 1882],
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(404);

    });

    it("Should return 201 if recommendation was criated", async () => {

        const ids = await db.query("SELECT id FROM genres;");
       
        const one = parseInt(ids.rows[0].id);
        
        
        const body = {
            name: "Falamansa - Xote dos Milagres",
            genresIds: [one],
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const response = await agent.post('/recommendations').send(body);

        expect(response.status).toBe(201);

    });

})

describe("POST /recommendations/:id/upvote", () => {
    it("Should return 404 if recommendation not exist", async () => {

        const response = await agent.post('/recommendations/99/upvote');

        expect(response.status).toBe(404);

    });

    it("Should return 200 if score was updated with 1 vote", async () => {

        const ids = await db.query("SELECT id FROM recommendations;");
        const id = ids.rows[0].id;
       
        const response = await agent.post(`/recommendations/${id}/upvote`);

        expect(response.status).toBe(200);

    });

});

describe("POST /recommendations/:id/downvote", () => {
    it("Should return 404 if recommendation not exist", async () => {

        const response = await agent.post('/recommendations/99/downvote');

        expect(response.status).toBe(404);

    });

    it("Should return 200 if score was updated with 1 vote less", async () => {

        const ids = await db.query("SELECT id FROM recommendations;");
        const id = ids.rows[0].id;
       
        const response = await agent.post(`/recommendations/${id}/downvote`);

        expect(response.status).toBe(200);

    });

    it("Should return 200 if the recommendation is deleted by having score equal to -5", async () => {

        const result = await db.query("SELECT * FROM recommendations;");
        const recommendation = result.rows[0];

        await db.query("UPDATE recommendations SET score = -3  WHERE id=$1", [recommendation.id]);
       
        const response = await agent.post(`/recommendations/${recommendation.id}/downvote`);

        expect(response.status).toBe(200);

    });

});

describe("GET /recommendations/random", () => {
    it("Should return 404 if don't have music registered", async () => {

        await db.query("DELETE FROM recommendations;");

        const response = await agent.get(`/recommendations/random`);

        expect(response.status).toBe(404);

    });

    it("Should return 200 if return a recommendation", async () => {
        
        const supercombo = await db.query('INSERT INTO recommendations (name,  "youtubeLink", score) VALUES ($1, $2, $3) RETURNING *;', ["Supercombo - Menina Lagarta", "https://www.youtube.com/watch?v=chwyjJbcs1Y", 13]);

        await db.query('INSERT INTO "genresRecommendations" ("recommendationId",  "genresId") VALUES ($1, $2);', [supercombo.rows[0].id, 1]);
        await db.query('INSERT INTO "genresRecommendations" ("recommendationId",  "genresId") VALUES ($1, $2);', [supercombo.rows[0].id, 3]);

        const rsigma = await db.query('INSERT INTO recommendations (name, "youtubeLink", score) VALUES ($1, $2, $3) RETURNING *;', ["RSigma - Cebola","https://www.youtube.com/watch?v=chwyjJbcs1Y", 13]);

        await db.query('INSERT INTO "genresRecommendations"  ("recommendationId",  "genresId") VALUES ($1, $2);', [rsigma.rows[0].id, 2]);

        await db.query('INSERT INTO "genresRecommendations"  ("recommendationId",  "genresId") VALUES ($1, $2);', [rsigma.rows[0].id, 4]);

        const response = await agent.get(`/recommendations/random`);

        expect(response.status).toBe(200);

    });

})

describe("GET /recommendations/genres/:id/random", () => {
    it("Should return 404 if there are no recommendations of this genre", async () => {

        const response = await agent.get(`/recommendations/genres/999/random`);

        expect(response.status).toBe(404);

    });

    it("Should return 200 if return a recommendation of this genre", async () => {

        const deadFish = await db.query('INSERT INTO recommendations (name,  "youtubeLink", score) VALUES ($1, $2, $3) RETURNING *;', ["DeadFish - Queda Livre", "https://www.youtube.com/watch?v=chwyjJbcs1Y", 1]);

        await db.query('INSERT INTO "genresRecommendations" ("recommendationId",  "genresId") VALUES ($1, $2);', [deadFish.rows[0].id, 3]);

        const response = await agent.get(`/recommendations/genres/3/random`);

        expect(response.status).toBe(200);

    });

} )