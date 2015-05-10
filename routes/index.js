var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controllers');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

var author = require('../controllers/author');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Definición de rutas de quizes
router.param('quizId', quizController.load);

// Definición de rutas de sesion
router.get('/login', sessionController.new);
router.post('/login', sessionController.create);
router.get('/logout', sessionController.destroy);



router.get('/quizes', quizController.index);

router.get('/quizes/:quizId(\\d+)', quizController.show);

router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);

router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);

router.get('/quizes/new', sessionController.loginRequired, quizController.new);

router.post('/quizes/create', sessionController.loginRequired, quizController.create);

router.get('/author' , author.author);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);

router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

module.exports = router;
