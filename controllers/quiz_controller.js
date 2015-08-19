var models = require('../models/models.js');

exports.load = function(req,res,next,quizId){
    models.Quiz.find({
        where:{id: Number(quizId)},
        include: [{model:models.Comment}]
    }).then(function(quiz){
        if(quiz){
            req.quiz = quiz;
            next();
        }else{
            next(new Error('No existe quizId='+quizId));
        }
    }).catch(function(error){next(error);});
};

exports.index = function(req,res){
    models.Quiz.findAll().then(function(quizes){
        res.render('quizes/index.ejs',{quizes: quizes, errors: []});
    }).catch(function(error){next(error);});
};

exports.show = function(req,res){
    models.Quiz.find(req.params.quizId).then(function(quiz){
        res.render('quizes/show',{quiz:req.quiz, errors: []});
    });
};

exports.answer = function(req,res){
    models.Quiz.find(req.params.quizId).then(function(quiz){
        if(req.query.respuesta === req.quiz.respuesta){
            res.render('quizes/answer',
                {quiz:quiz, respuesta:'Correcta', errors: []});
        }else{
            res.render('quizes/answer',
                {quiz: req.quiz, respuesta:'Incorrecta', errors: []});
        };
    });
};

exports.new = function(req,res){
    var quiz = models.Quiz.build({pregunta:"Pregunta",respuesta:"Respuesta",tema:"otro"});
    res.render('quizes/new',{quiz:quiz, errors: []});
};

exports.create = function(req,res){
    var quiz = models.Quiz.build(req.body.quiz);
    
    console.log("antes de then.");
    quiz
    .validate()
    .then(function(err){
        if(err){
            res.render('quizes/new',{quiz: quiz, errors: err.errors});
        }else{
            quiz
            .save({fields:["pregunta","respuesta","tema"]})
            .then(function(){
                res.redirect('/quizes');
            });
        }
    })
};

exports.edit = function(req, res) {
    var quiz = req.quiz;
    res.render('quizes/edit',{quiz:quiz, errors: []});
};

exports.update = function(req, res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    
    req.quiz.validate().then(function(err){
        if(err){
            res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
        } else {
            req.quiz.save({fields: ["pregunta","respuesta","tema"]})
            .then(function(){
                res.redirect("/quizes");
            });
        };
    });
};

exports.destroy = function(req,res){
    req.quiz.destroy().then(function(){
        res.redirect('/quizes');
    }).catch(function(error){next(error)});
};
