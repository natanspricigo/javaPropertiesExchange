
var httpUtils = {
	objectFromBody: function(body, name){
		var obj = {};
		obj.name={};

		var chaves = Object.keys(body);
		chaves.forEach(function(e){
			if (e && e != "") {
				if (e.indexOf('.') != -1) {
					var nameO = e.split('.')[0];
					var valueO = e.split('.')[1];
					var t = {};
					t[nameO] = {};
					t[nameO][valueO] = body[e];
					var nw = httpUtils.objectFromBody(t[nameO]);
					if (obj.name[nameO]) {
						obj.name[nameO][valueO] = nw[valueO];
					}else{
						obj.name[nameO] = nw;
					}
				}else{
					obj.name[e] = body[e];
				}
			};
		});
		return obj.name;
	}
}


module.exports.http = httpUtils;