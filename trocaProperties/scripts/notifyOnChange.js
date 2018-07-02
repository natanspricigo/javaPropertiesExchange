const notifier = require('node-notifier');


class Observador {
	constructor(change, message, intervalo){
		this.change = change;
		this.state = undefined;
		this.intervalo = intervalo || 5000;
		this.message = message || {title: "", message: ""};
	}

	init(){
		this.state = this.change();
		var self = this;
		var estado;
		setInterval(()=>{
			estado = self.change();
			if (self.state != estado) {
				notifier.notify(self.message(self.state, estado));
				self.state = estado;
			};
		},self.intervalo);
	}
}


exports.notifyOnChange = function(change, message, intervalo){
	return new Observador(change, message, intervalo);
};