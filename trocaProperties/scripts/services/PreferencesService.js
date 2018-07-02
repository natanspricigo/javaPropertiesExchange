
class Preference{

	constructor(){
		this.id = "";
		this.diretorioGit = "";
		this.caminhoProperties = "";
		this.caminhoArquivos = "";
	}

	isValid(){
		return this.location != undefined;
	}
}

class PreferencesSerice{
	constructor(){
		this.preferences = this._read();
	}
	
	newPreference(){
		return new Preference();
	}

	_read(){}
	write(preference){
		if (preference.constructor.name == "Preference") {
			console.log("Aqui deve Gravar no arquivo")
		};

	}

	getFromWorkspace(workspace){
		return this.preferences.filter((e)=>{
			return e.location === workspace;
		});
	}
}

module.exports.PreferencesSerice = PreferencesSerice;
