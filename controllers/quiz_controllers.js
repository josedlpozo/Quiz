var models = require('../models/models.js');

// Autoload
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
			where: { id: Number(quizId)},
			include: [{model: models.Comment }]
		}).then(
		function(quiz) {
			if(quiz){
				req.quiz = quiz;
				next();
			}else{ next(new Error('No existe quizId='+quizId));
			}
		}
	).catch(function(error){next(error);});
};

// PUT /quizes/:id

exports.update = function(req,res){

	if(req.files.image){
		req.body.quiz.image = req.files.image.name;
	}

	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				req.quiz
				.save( {fields: ["pregunta", "respuesta", "image"]})
				.then( function(){ res.redirect('/quizes');});
			}
		}
		);
};

// DELETE /quizes/:id

exports.destroy = function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
 
// GET /quizes

exports.index = function(req,res){
	if(req.query.search === undefined){
		var options = {};
		if(req.user){
			options.where = {UserId: req.user.id};
		}
		models.Quiz.findAll(options).then(function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}).catch(function(error){next(error);})	
	}else{
		var search = req.query.search;
		search = "%"+search+"%";
		search = search.replace(/ /g,'%');
		console.log(search);
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(function(quizes){
						res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
		}).catch(function(error){next(error);})	
	}
		
};

// GET /quizes/new

exports.new = function(req,res){
	var quiz = models.Quiz.build(
		{pregunta : "Pregunta", respuesta : "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create

exports.create = function(req, res){
	req.body.quiz.UserId = req.session.user.id;
	if(req.files.image){
		req.body.quiz.image = req.files.image.name;
	}

	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(function(err){
		if(err){
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		}else{
			quiz
			.save({fields: ["pregunta", "respuesta","UserId", "image"]})
			.then(function(){
				res.redirect('/quizes')})
		}
	});
};

// GET /quizes/:id/edit

exports.edit = function(req,res){
	var quiz = req.quiz;
	console.log('edit');
	res.render('quizes/edit', {quiz: quiz, errors: []});
}

// GET /quizes/show

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
	res.render('quizes/show', {quiz: req.quiz, errors: []});
	})
};

// GET /quizes/answer
exports.answer = function(req,res){
	var resultado = 'Incorrecto';	
	if(req.query.respuesta === req.quiz.respuesta){
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz:req.quiz, respuesta:resultado, errors: []});
};

// MW permite acciones solamente si el quiz objeto pertenece al usuario logueado o si es cuenta admin

exports.ownershipRequired = function(req,res,next){
	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if(isAdmin || objQuizOwner === logUser){
		next();
	}else{
		res.redirect('/');
	}
};

// GET /quizes/statistics

exports.statistics = function(req,res){
	models.Quiz.count().then(function(count){
		res.json({
			num_preg : count
		});
	});

	models.Comment.count().then(function(count){
		res.json({
			num_comment : count
		});
	})

	console.log(JSON.stringify(res.json.num_preg));
	console.log(JSON.stringify(res.json.num_comment));

};
