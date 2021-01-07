const recommendationSchema = require('../schemas/recommendationsSchema');
const Recommendation = require('../models/Recommendation');
const Genre = require('../models/Genre');



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

        //confirmar ids
        for (let i = 0; i < genresIds.length; i++) {
          
          const id = parseInt(genresIds[i]);
          const idGenre = await Genre.findOne({where: {id}});

          if(!idGenre) {
            return res.sendStatus(404);
          }

        }

        await Recommendation.create({ name, genresIds, youtubeLink });
        res.sendStatus(201);

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

        recommendation.score ++

        await recommendation.save();
        res.sendStatus(200);

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
  
    
  }
  
  module.exports = new RecommendationsController();