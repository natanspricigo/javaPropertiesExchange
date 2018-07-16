/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path');

const notifier = require('node-notifier');
const notifyOnChange = require('./scripts/notifyOnChange');
const branchService = require('./scripts/services/BranchService');
const PreferencesService = require('./scripts/services/PreferencesService');
const dbm = require('./scripts/services/DatabaseService');
const Utilitarios = require('./scripts/Utilitarios/Utilitarios');

const dataMananger = new dbm.DatabaseMananger();

var branchsAcessadas = [];

// ----------------Notificações ao alterar---------------
var ch = () => {
	var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);
	return branchService.getBranch(pref.caminhoGit);
}
var msgCreator = (oldState, newState) => {
	if (newState && newState != "") {
		branchsAcessadas.push({
			branchAntiga: oldState,
			branchNova: newState
		});
		notifier.notify({
			title: 'Troca de branch',
			message: 'Trocamos a branch <' + oldState + "> para a branch <" + newState + "> ",
			sound: true,
		});
	} else {
		branchsAcessadas = [];
	}
}

notifyOnChange.notifyOnChange(ch, msgCreator, 5000).init();

// --------------------------------------------------------

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', (req, res) => {

	var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);
	var mapa = dataMananger.getAll(dataMananger.tableNames.MAPA);

	routes.index(req, res, {
		title: 'Meu git',
		branch_atual: branchService.getBranch(pref.caminhoGit),
		preferences: pref,
		historico: JSON.stringify(branchsAcessadas),
		mapa : mapa
	})
});

app.get('/users', user.list);

app.get('/branch', (req, res) => {

	var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);

	res.json(branchService.getBranch(pref.caminhoGit));
});

app.get('/history', (req, res) => {
	res.json(branchsAcessadas);
});

app.get('/remover-mapa', (req, res) => {
	console.log("removendo...")
});

app.post('/configuracao/salvar', (req, res) => {
	var response = Utilitarios.http.objectFromBody(req.body, "args");
	__DIR = response.preference.caminhoGit;
	dataMananger.insert(dataMananger.tableNames.PREFERENCIAS, response.preference);
	console.log(response.preference);
	res.redirect('/');
});

app.post('/mapa/salvar', (req, res) => {
	var response = Utilitarios.http.objectFromBody(req.body, "args");
	console.log(response.mapa);
	dataMananger.insert(dataMananger.tableNames.MAPA, response.mapa);
	res.redirect('/');
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));

	notifier.notify({
		title: 'Estamos em atividade',
		message: 'Trocador de propriedades ativo !',
		sound: true,
	});

});