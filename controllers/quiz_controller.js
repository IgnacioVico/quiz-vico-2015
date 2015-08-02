var models = require('../models/models.js');

exports.index = function(req,res){
    models.Quiz.findAll().then(function(quizes){
        console.log(quizes);
        console.log(quizes.length);
        res.render('quizes/index.ejs',{quizes: quizes});
    });
};

exports.show = function(req,res){
    models.Quiz.find(req.params.quizId).then(function(quiz){
        res.render('quizes/show',
            {quiz:quiz});
    });
};

exports.answer = function(req,res){
    models.Quiz.find(req.params.quizId).then(function(quiz){
        if(req.query.respuesta === quiz.respuesta){
            res.render('quizes/answer',
                {quiz:quiz, respuesta:'Correcta'});
        }else{
            res.render('quizes/answer',
                {quiz: quiz, respuesta:'Incorrecta'});
        };
    });
};

