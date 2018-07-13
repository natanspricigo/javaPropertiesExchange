const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

var ps = require("./PreferencesService");
var preferencesSerice = new ps.PreferencesSerice();

class DatabaseMananger{

	constructor(){
		this.tableNames={PREFERENCIAS:"preferencias", HISTORICO: "historico", MAPA:"mapa"};
		db.defaults({ preferencias: [], count: 0 }).write();
		db.defaults({ historico: []}).write();
		db.defaults({ mapa: []}).write();
		this.nativeDb = db;
	}
	
	__getTable(table){
		if (db.has(table).value()) {
			return db.get(table);
		};
		return undefined;
	}

	__findMaxIDToTable(table){
		var cod = 0;
		this.__getTable(table).forEach(function(index) {
			if (index.id > cod) {
				cod = index;
			};
		});
		return cod;
	}

	insert(table, data){

		if (data && (data.id == undefined || data.id == "")) {
			data.id = this.__findMaxIDToTable(table) + 1;
		}else{
			this.update(table, data);
		}

		data.id=Number(data.id);
		var result = this.__getTable(table).push(data).write();
		db.update('count', n => n + 1).write();
		return result;
	}

	get(table, id){
		var retorno = this.__getTable(table).find({ id: id }).value();
		if (retorno) {
			return retorno;
		}else{
			return preferencesSerice.newPreference();
		}
	}
	
	getAll(table){
		return db.get(table)
		  .value()
	}

	update(table, newData){
		newData.id=Number(newData.id);
		return this.__getTable(table)
		  .find({ id: newData.id})
		  .assign(newData)
		  .write();
	}

	remove(table, idToRemove){
		return this.__getTable(table)
		  .remove({ id: idToRemove})
		  .write()
	}
}

module.exports.DatabaseMananger = DatabaseMananger;
