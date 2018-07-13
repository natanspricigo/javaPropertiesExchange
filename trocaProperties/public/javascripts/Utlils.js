var Utils = {
	parametros : {
		moeda : "R$",
		precisaoMoeda : 2,
	},

	formatMoney : function(valor, mostraPrefixo) {
		var v = Utils.strToNumber(valor, 0);
		if ( isNaN(v) ) {
			v = '';
		} else {
			v = v.toFixed(Utils.parametros.precisaoMoeda);
			if ( parseFloat(v) == 0 )
				v = v.replace('-', '');
			v = v.toString().replace('.', ',');
			v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
		}
		return mostraPrefixo ? (Utils.parametros.moeda + ' ' + v) : v;
	},

	strToNumber : function(valor, defaultValue) {
		defaultValue = defaultValue == undefined ? 0 : defaultValue;
		
		if ( valor == undefined || valor == "") {
			return defaultValue;
			
		} else if ( typeof valor === 'number' ) {
			return valor;
			
		} else if ( typeof valor === 'string' ) {
			valor = getNumber(valor);
			valor = valor != 0 ? valor : defaultValue;
		}
		
		var valorNumerico = Number.parseFloat(valor);
		if ( isNaN(valorNumerico) ) {
			return defaultValue;
		}
		
		return valorNumerico;
	},

	numberToStr : function(valor, separador) {
		if ( valor == undefined ) {
			return "";
		}
		valor = valor.toString().replace(",", ".");
		valor = this.strToNumber(valor);
		return separador == undefined ? valor.toString() : valor.toString().replace(".", separador);
	},

	notNull : function(value, defaultValue) {

		var invalid = [ undefined, null ].filter(function(e) {
			return value == e;
		});
		if ( defaultValue == undefined ) {
			defaultValue = "";
		}
		if ( invalid.length > 0 ) {
			return defaultValue;
		}
		return value;
	},

	replaceAll : function(texto, chave, valor) {
		if ( typeof texto == 'undefined' ) {
			texto = "";
		}
		if ( typeof valor == 'undefined' ) {
			valor = "";
		}
		if ( typeof texto == "string" ) {
			return texto.replace(new RegExp(chave + "", "ig"), valor);
		}
		return texto;
	},

	formatTemplate : function(object, template) {
		var texto = String(template);

		function resolve(objecto, prefix) {
			prefix = typeof prefix == "undefined" ? "" : prefix;

			var keys = Object.keys(objecto);
			keys.forEach(function(chave) {

				if ( typeof objecto[chave] == "object" ) {
					var _ch = "";
					if ( prefix == "" ) {
						_ch = chave;
					} else {
						_ch = prefix + "." + chave;
					}
					return resolve(objecto[chave], _ch);

				} else {
					var str;

					if ( typeof objecto[chave] === "function" ) {
						str = objecto[chave]();

						switch ( typeof str ) {
						case "undefined" :
							log.error("A função que você criou precisa retorar algum texto ! ");
							str = "";
							break;
						case "object" :
							str = str.toString();
							break;
						default :
							break;
						}
					} else {
						str = objecto[chave];
					}

					chave = prefix != '' ? prefix + '.' + chave : chave;
					texto = Utils.replaceAll(texto, '{{' + chave + '}}', str);
				}
			});
			return texto;
		}

		return resolve(object);
	},
	
	Calc : {
		calcularPorcentagem : function(subtotal, total){
			if(total === 0){
				return 0;
			}
			return Utils.Calc.arredondar(subtotal / total * 100);
		},
		calcularValorPorcentagem : function(percentual, total){
			return Utils.Calc.arredondar(total * percentual / 100);
		},
		arredondar : function(valor, precisao){
			if(!isNumber(valor)){
				return 0;
			}
			return parseFloat(valor.toFixed(precisao || 2));
		}
	}

}
