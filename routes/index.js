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
router.param('quizId', quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de sesion
router.get('/login', sessionController.auto_logout, sessionController.new);
router.post('/login', sessionController.auto_logout, sessionController.create);
router.get('/logout', sessionController.auto_logout, sessionController.destroy);



router.get('/quizes', sessionController.auto_logout, quizController.index);

router.get('/quizes/:quizId(\\d+)', sessionController.auto_logout, quizController.show);

router.get('/quizes/:quizId(\\d+)/answer', sessionController.auto_logout, quizController.answer);

router.put('/quizes/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, quizController.update);

router.delete('/quizes/:quizId(\\d+)', sessionController.auto_logout, sessionController.loginRequired, quizController.destroy);

router.get('/quizes/:quizId(\\d+)/edit', sessionController.auto_logout, sessionController.loginRequired, quizController.edit);

router.get('/quizes/new', sessionController.auto_logout, sessionController.loginRequired, quizController.new);

router.post('/quizes/create', sessionController.auto_logout, sessionController.loginRequired, quizController.create);

router.get('/quizes/statistics', sessionController.auto_logout, sessionController.loginRequired, quizController.statistics);

router.get('/author' , author.author);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', sessionController.auto_logout, commentController.new);

router.post('/quizes/:quizId(\\d+)/comments', sessionController.auto_logout, commentController.create);

router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.auto_logout, sessionController.loginRequired, commentController.publish);

module.exports = router;
