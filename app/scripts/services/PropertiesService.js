const Cache = require('./CacheService');
const fileService = require('./FileService').fileService;
const notifier = require('node-notifier');

class PropertiesService {

	constructor(preferences, cacheFiles, mapa) {
		this.preferences = preferences;
		this._cacheFiles = cacheFiles;
		this.mapa = mapa;
		this.branchProvider = () => {
			return null
		};
		this.branchAtual = null;
		this.branchNova = null;
		this.extensionFile = ".properties";
		this.run();
	}

	addBranchProvider(branchProvider) {
		this.branchProvider = branchProvider;
	}

	run() {
		this.branchNova = this.branchProvider();
		if (this.branchNova && this.branchNova != null && this.branchNova != this.branchAtual) {
			this.trocaProperties(this.branchNova);
			this.branchAtual = this.branchNova;
		};
	}

	getCache() {
		if (this._cacheFiles && this._cacheFiles != null) {
			return this._cacheFiles;
		}
		return new Cache();
	}

	getFileNameWithBrach(branch) {
		if (this.mapa) {
			var itemMapa = this.mapa.filter(function(index) {
				return index.branch == branch;
			});

			if (itemMapa && itemMapa.length > 0) {
				return itemMapa[0].nomeArquivo + this.extensionFile;
			};
		};
		return "default" + this.extensionFile;
	}

	trocaProperties(novaBranch) {

		const fileBranch = this.getCache().get(this.getFileNameWithBrach(novaBranch));
		const extensionFile = this.extensionFile;

		if (fileBranch && this.preferences) {
			
			const pathOut = this.preferences.caminhoProperties 
							+ "/" 
							+ this.preferences.nomeArquivoSaida 
							+ extensionFile;

			fileService.write(pathOut, fileBranch.valor, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Gravado %s bytes no arquivo %s', fileBranch.valor.length, pathOut);
					notifier.notify({
						title: 'Troca de ' + extensionFile,
						message: "Trocamos de arquivo, agora é o arquivo : " + fileBranch.chave,
						sound: true,
						wait: false
					});
				}
			});
		};
	}
}

module.exports = PropertiesService;