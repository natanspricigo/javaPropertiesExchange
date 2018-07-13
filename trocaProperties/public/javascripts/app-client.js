
function getTemplateNovoItemMapa(props){

	var template = '<form action="/mapa/salvar" method="post">'
						+'<h3>Branch -> arquivo</h3>'
						+'<div class="form-control">'
							+'<label for="branch" class="xs-4 text-right">Nome da branch</label>'
							+'<input type="text" id="branch" name="mapa.branch" value="" class="xs-2">'
						+'</div>'
						+'<div class="form-control">'
							+'<label for="nomeArquivo" class="xs-4 text-right">Nome do arquivo .properties</label>'
							+'<input type="text" id="nomeArquivo" name="mapa.nomeArquivo" value="" class="xs-2">'
						+'</div>'
						+'<div class="form-actions">'
							+'<div class="align-right">'
								+'<button type="submit" class="button btn-save" style="color:#fff">Salvar </button>'
							+'</div>'
						+'</div>'
					+'</form>';

	return template;
}