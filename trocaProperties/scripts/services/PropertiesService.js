const Cache = require('./CacheService');
const fileService = require('./FileService').fileService;

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
		this.run();
	}

	addBranchProvider(branchProvider) {
		this.branchProvider = branchProvider;
	}

	run() {
		this.branchNova = this.branchProvider();
		if (this.branchNova != null && this.branchNova != this.branchAtual) {
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
				return itemMapa[0].nomeArquivo + ".properties";
			};
		};
		return "default.properties";
	}

	trocaProperties(novaBranch) {

		const fileBranch = this.getCache().get(this.getFileNameWithBrach(novaBranch));

		if (fileBranch && this.preferences) {
			const pathOut = this.preferences.caminhoProperties + "/" + this.preferences.nomeArquivoSaida + "______.properties";

			function grava() {
				fileService.write(pathOut, fileBranch.valor, (err) => {
					if (err) {
						console.log(err);
					} else {
						console.log('Gravado %s bytes no arquivo %s', fileBranch.valor.length, pathOut)
					}

				});
			}

			fileService.clear(pathOut, (err) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Arquivo %s limpo !', pathOut);
					grava();
				}
			});



		};
	}
}

module.exports = PropertiesService;