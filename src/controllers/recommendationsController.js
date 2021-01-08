const recommendationSchema = require('../schemas/recommendationsSchema');
const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');
const GenresRecommendations = require('../models/GenresRecommendations');

class RecommendationsController{
    async postRecommendation(req, res) {
      try {
        
        const validationSchema = recommendationSchema.postRecommendation.validate(req.body);
        if(validationSchema.error) return res.sendStatus(422);

        const {
          name,
          genresIds,
          youtubeLink
        } = req.body;

        const recommendation = await Recommendation.create({ name, youtubeLink });

        //confirmar ids
        for (let i = 0; i < genresIds.length; i++) {

          const id = parseInt(genresIds[i]);
          const genre = await Genre.findOne({where: {id}});
          
          if(!genre) {
            return res.sendStatus(404);
          } 
          
          await GenresRecommendations.create({ recommendationId: recommendation.id, genresId: genre.dataValues.id });

        }

        return res.sendStatus(201);

      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    }
    
    async upVote(req, res) {
      try {
        const id = req.params.id;
        const recommendation = await Recommendation.findByPk(id);
        
        if(!recommendation) {
          return res.sendStatus(404);
        }
        
        recommendation.score++
        await recommendation.save();
        
        return res.sendStatus(200);

      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    }

    async downVote(req, res) {
      try {

        const id = req.params.id;
        const recommendation = await Recommendation.findByPk(id);

        if(!recommendation) {
          return res.sendStatus(404);
        }

        if (recommendation.score !== -5){
          recommendation.score--
          await recommendation.save();
        } else {
          //excluir recommendacao
          await recommendation.destroy();
        }

        res.sendStatus(200);

      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }
    }

    async random(req,res){
      try {

        const allRecommendations = await Recommendation.findAll({
          include: {
            model: Genre,
            as: 'genres',
            through: { attributes: [] }
          },
        });
        
        if(allRecommendations.length === 0) return res.sendStatus(404);
        
        const veryPopular = [];
        const unpopular = [];

        for (let i = 0; i < allRecommendations.length; i++) {

          if(allRecommendations[i].score > 10){
            veryPopular.push(allRecommendations[i]);

          } else {
            unpopular.push(allRecommendations[i]);
          }
        }

        if(veryPopular.length == 0 || unpopular.length == 0 ){
          const shuffle = Math.floor(Math.random() * (allRecommendations.length)) + 1;
          return res.send(allRecommendations[shuffle-1]).status(200);
        }

        let aux = Math.random().toFixed(1);
        
        if(aux < 0.7){
          const shuffle = Math.floor(Math.random() * (veryPopular.length)) + 1;
          return res.send(veryPopular[shuffle-1]).status(200);

        } else {
          const shuffle = Math.floor(Math.random() * (unpopular.length )) + 1;
          return res.send(unpopular[shuffle -1]).status(200);
        }

      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }

    }

    async randomGenre(req, res) {

      try {

        const id = parseInt(req.params.id);
        const recommendationsByGenre = await GenresRecommendations.findAll({where: {genresId: id}});

        if(recommendationsByGenre.length === 0) {
          return res.sendStatus(404);
        }

        const shuffle = Math.floor(Math.random() * (recommendationsByGenre.length)) + 1;

        const recommendationId = recommendationsByGenre[shuffle-1].recommendationId;

        const theRecommendations = await Recommendation.findOne({
          where: {id: recommendationId},
          include: {
            model: Genre,
            as: 'genres',
            through: { attributes: [] },
      
          },
        });

      return res.send(theRecommendations).status(200);

      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }

    }
  
  }
  
  module.exports = new RecommendationsController();