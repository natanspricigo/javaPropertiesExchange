const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

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
		this.getAll(table).forEach(function(index) {
			if (index.id > cod) {
				cod = index.id;
			};
		});
		return cod || 0;
	}

	insert(table, data){
		if (data && (data.id == undefined || data.id == "" || data.id == null || isNaN(data.id))) {
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
		var retorno = this.__getTable(table).find({ "id": Number(id) }).value();
		if (retorno) {
			return retorno;
		}
	}
	
	getAll(table){
		return db.get(table).value()
	}

	update(table, newData){
		newData.id=Number(newData.id);
		return this.__getTable(table)
		  .find({ id: newData.id})
		  .assign(newData)
		  .write();
	}

	remove(table, obj){
		if (obj) {
			console.warn("Removendo codigo %s da tabela %s", (obj?obj.id:"???????"), table);
			return this.__getTable(table)
			  .remove(obj)
			  .write();
		}
	}
}

module.exports.DatabaseMananger = DatabaseMananger;
