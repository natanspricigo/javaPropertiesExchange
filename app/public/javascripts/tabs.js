class Tabs {
	constructor(base, baseContent) {
		this.base = document.getElementById(base);
		this.baseContent = document.getElementById(baseContent);
		this.classeAtivo = "active";
		if (this.base == null) {
			throw new Error("Não foi encontrado o id " + base);
		};
	}

	removerTodosOsAtivosDoMenu(base) {
		var self = this;
		base.querySelectorAll(" ." + self.classeAtivo).forEach(function(item) {
			item.className = item.className.replace(self.classeAtivo, "");
		});
	}

	events() {
		var self = this;

		tabs.base.querySelectorAll(".tab-item").forEach((e, i) => {
			e.addEventListener("click", function() {
				self.removerTodosOsAtivosDoMenu(self.base);
				if (this.className.indexOf(self.classeAtivo) != -1) {
					this.className = this.className.replace(self.classeAtivo, "");
				} else {
					this.className = this.className + " " + self.classeAtivo;
				}
				self.trocarContent(this)
			}, false);
		});
	}

	trocarContent(menuLi){
		var tab = this.baseContent.querySelectorAll("#"+menuLi.dataset.tab);
		this.removerTodosOsAtivosDoMenu(this.baseContent);
		if (tab[0].className.indexOf(self.classeAtivo) != -1) {
			tab[0].className = tab[0].className.replace(this.classeAtivo, "");
		} else {
			tab[0].className = tab[0].className + " " + this.classeAtivo;
		}
	}
}