class Modal{
    
    constructor(properties){
        this.identificador = "modal" + this.newID;
        this.template = this.getTemplate;
        this.body = "";
        this.properties = properties;
        this.properties.id = this.identificador;
        this.out = this.compile(properties);
        this._gravar();
    }
    
    get newID(){
    	return Math.random().toString(16).replace('\.',"");
    }
    
    get getTemplate(){
    	return '<div id="{{id}}" class="modal" style="display:nome" >'
		    		+'<div class="modal-head"><span>{{modalTitle}}</span><a href="#" class="close">x</a></div>'
		    		+'<div class="modal-body">{{modalBody}}</div>'
    			+'</div>';
    }

    compile(props){
    	if (props.modalBody && typeof props.modalBody == 'function') {
    		props.modalBody = props.modalBody(props);
    	};
    	return Utils.formatTemplate(props, this.template);
    }
    
    _gravar(){
    	var el =  document.createElement('div');
		el.innerHTML = this.out;
		document.body.appendChild(el);
		document.getElementById(this.identificador).style.display = "none";
		this.events();
    }

    events(){
    	var self = this;
    	 document.querySelector("#"+this.identificador + " .close").addEventListener("click", ()=>{
    	 	self.close();
    	 });
    }

    open(){
    	document.getElementById(this.identificador).setAttribute("style", "");
    }

    close(){
    	document.getElementById(this.identificador).setAttribute("style", "display: none");
    }

}