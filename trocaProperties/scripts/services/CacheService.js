'use strict';

module.exports = class Cache {

	constructor() {
		this._base = [];
	}

	_newItem(chave, valor) {
		return {
			chave: chave,
			valor: valor
		}
	}

	loader(func){
		func(this);
	}

	add(chave, valor) {
		if (this.exists(chave)) {
			this.remove(chave);
		}
		this._base.push(this._newItem(chave, valor));
	}

	keys(){
		return this._base.map((e)=>{return e.chave;});
	}

	exists(chave) {
		var pesq = this.keys().filter(function(index) {
			return chave == index;
		});
		return pesq.length > 0;
	}

	all(){
		return this._base;
	}

	get(chave) {
		var pesq = this._base.filter(function(index) {
			return chave == index.chave;
		});
		return pesq.length > 0 ? pesq[0] : null;
	}

	remove(chave) {
		var pesq = this._base.filter(function(index) {
			return chave != index.chave;
		});
		this._base = pesq;
	}

	clear() {
		this._base = [];
	}

};