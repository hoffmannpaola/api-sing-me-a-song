
async function createRecomendations(db, name, score, genres) {

  const youtube = "https://www.youtube.com/watch?v=chwyjJbcs1Y";
 
  const recommendation = await db.query('INSERT INTO recommendations (name,  "youtubeLink", score) VALUES ($1, $2, $3) RETURNING *;', [name, youtube, score]);

  for (let i = 0; i < genres.length; i++) {

    await db.query('INSERT INTO "genresRecommendations" ("recommendationId",  "genresId") VALUES ($1, $2);', [recommendation.rows[0].id, genres[i]]);

  }

}

async function createGenres(db, name) {
  
  await db.query("INSERT INTO genres (name) values ($1);", [name]);

}


module.exports = { 
  createRecomendations,
  createGenres
};