
class App {

	constructor(){
		this.branchAtual = undefined;
	}

	getBranch(onConplete){
		axios.get('/branch')
		  .then(function (response) {
		    onConplete(response);
		  })
		  .catch(function (error) {
		    console.log(error);
		});
	}

	observe(){
		var self = this;
		setInterval(()=>{
			self.getBranch((response)=>{
				if (self.branchAtual != response.data) {
					self.branchAtual = response.data;
					document.getElementsByClassName("branch")[0].innerText = self.branchAtual;
					notifyMe("Modou a branch, agora é a " + self.branchAtual);
				};
			});
		},5000);
	}

}


var app = new App();
app.getBranch((response)=>{
	app.branchAtual = response.data;
});

app.observe();