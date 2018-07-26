/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');

var moment = require('moment');

const notifier = require('node-notifier');
const notifyOnChange = require('./scripts/notifyOnChange');
const branchService = require('./scripts/services/BranchService');
const fileService = require('./scripts/services/FileService').fileService;
const CacheService = require('./scripts/services/CacheService');
const PropertiesService = require('./scripts/services/PropertiesService');
const dbm = require('./scripts/services/DatabaseService');

const Utilitarios = require('./scripts/Utilitarios/Utilitarios');

const dataMananger = new dbm.DatabaseMananger();
var cache = new CacheService();
var propertiesService;

var getBranchName = () => {
	var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);
	return branchService.getBranch(pref.caminhoGit);
}

var onChangeBranch = (oldState, newState) => {
	if (newState && newState != "") {
		var hist = {
			branchAntiga: oldState,
			branchNova: newState,
			date: moment().format("DD/MM/YYYY  hh:mm")
		};
		
		dataMananger.insert(dataMananger.tableNames.HISTORICO, hist);

		//troca o conteudo do arquivo .properties
		propertiesService.run();

	}
}

function startCache(){
	cache.loader((_cache) => {
		var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);
		var mapa = dataMananger.getAll(dataMananger.tableNames.MAPA);
		if (pref) {
			fileService.readFiles(pref.caminhoArquivos+"/", function(f, c) {
				_cache.add(f, c);
			}, (err) => {
				console.log(err)
			});

			// inicia a mágica da troca de conteudo do arquivo !
			propertiesService = new PropertiesService(pref, cache, mapa);
			propertiesService.addBranchProvider(getBranchName);
			propertiesService.run();
		};
	});
};
startCache();

// ----------------Notificações ao alterar---------------

notifyOnChange.notifyOnChange(getBranchName, onChangeBranch, 5000).init();

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
	var historico = dataMananger.getAll(dataMananger.tableNames.HISTORICO);

	routes.index(req, res, {
		title: 'Java properties exchange',
		branch_atual: branchService.getBranch(pref.caminhoGit),
		preferences: pref,
		historico: historico,
		mapa: mapa
	})
});

app.get('/cacheFiles', (req, res) => {
	res.json(cache.all());
});

app.get('/reloadCacheFiles', (req, res) => {
	console.log("Limpado cache de arquivos...");
	cache.clear();
	startCache();
	console.log("Cache limpo  e recarregado !");
	res.redirect('/');
});

app.get('/branch', (req, res) => {
	var pref = dataMananger.get(dataMananger.tableNames.PREFERENCIAS, 1);
	res.json(branchService.getBranch(pref.caminhoGit));
});

app.get('/history', (req, res) => {
	var historico = dataMananger.getAll(dataMananger.tableNames.HISTORICO);
	res.json(historico);
});

app.get('/remover-mapa', (req, res) => {
 	dataMananger.remove(dataMananger.tableNames.MAPA, req.param('codigo'));
	res.redirect('/');
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