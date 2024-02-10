var ListagemDatasets = SuperWidget.extend({
    //variáveis da widget
    loading: null,
    variavelNumerica: null,
    variavelCaracter: null,
    nr_ficha: null,
    nr_versao: null,
    nm_fichario: null,
    nr_fichario: null,
    campos_visiveis: null,
    dataInit: null,
    searched: null,
    obj: null,
    
    //método iniciado quando a widget é carregada
    init: function() {
    	try{
    		ListagemDatasets.loading = FLUIGC.loading(window);
    		ListagemDatasets.loading.show();
    		
    		ListagemDatasets.obj = window["ListagemDatasets_" + this.instanceId];
    		ListagemDatasets.obj.sucessoAoGravar = ListagemDatasets.sucessoAoGravar;
    		ListagemDatasets.obj.insucessoAoGravar = ListagemDatasets.insucessoAoGravar;
    		
	    	ListagemDatasets.nm_fichario = this.nmFichario;
	    	ListagemDatasets.nr_fichario = this.nrFichario;
	    	ListagemDatasets.campos_visiveis = this.camposTela;
	    	ListagemDatasets.nm_campos_visiveis = this.nmCamposTela;
	    	this.loadDadosDataset();
	    	var that = this;
	    	var form_mode = that.getUrlParameter("form_mode");
	    	
	    	$('#dados_dataset').on('fluig.datatable.loadcomplete', function() {
	
	            $(".listagem_datasets_widget button#datatable-edit-row").attr("disabled", "disabled");
	            $(".listagem_datasets_widget button#datatable-del-row").attr("disabled", "disabled");
	
	        });
	        $('.listagem_datasets_widget #dados_dataset').on('fluig.datatable.onselectrow', function() {
	            $(".listagem_datasets_widget button#datatable-edit-row").removeAttr("disabled");
	            $(".listagem_datasets_widget button#datatable-del-row").removeAttr("disabled");
	        });
	    		        
	    		       
	        var campos_tela = that.camposTela;
	    	var array_campos = new Array();
	    	array_campos = campos_tela.split(",");
	    	
	    	var array_nome_campos = [];
	    	
	    	var nm_campos_tela = that.nmCamposTela;
	    	var array_nm_campos = new Array();
	    	array_nm_campos = nm_campos_tela.split(",");
	    	
	    	$(document).on('shown.bs.modal','#modal_registro', function () {
	    	       $(this).find('.modal-body').css({
	    	              width:'auto', //probably not needed
	    	              height:'auto', //probably not needed 
	    	              'max-height':'100%'
	    	       });
	    	});
	    	
	    	if(form_mode != undefined){
	    		if(form_mode == "add"){
	    			that.addRow();
	    		}else if(form_mode == "edit"){
	    			that.editRow();
	    		}
	    	}
	    	ListagemDatasets.loading.hide();
    	} catch(e){
    		ListagemDatasets.loading.hide();
    		console.error(e);
	    }
    },
  
    //BIND de eventos
    bindings: {
        local: {
        	'datatable-add-row': ['click_addRow'],
            'datatable-edit-row': ['click_editRow'],
            'datatable-del-row': ['click_deleteCard'],
            'save-params' : [ 'click_saveParams' ],
            'load-registros' : ['click_loadDadosDataset']
        },
        global: {
        	'save-modal': ['click_updateModal'],
        	'save-modal-inclusao': ['click_createModal']
        }
    },
 
    getUrlParameter: function(sParam) {
		var sPageURL = window.location.search.substring(1),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
	},
    
    saveParams : function(element, event) {
		var preferences = {};
		preferences.nrFichario = $('#nrFichario_' + this.instanceId).val();
		preferences.nmFichario = $('#nmFichario_' + this.instanceId).val();
		preferences.camposTela = $('#camposTela_' + this.instanceId).val();
		preferences.nmCamposTela = $("#nmCamposTela_" + this.instanceId).val();
		WCMSpaceAPI.PageService.UPDATEPREFERENCES({
			async : true,
			success : function(data) {
				FLUIGC.toast({
					message : data.message,
					type : 'success'
				});
			},
			fail : function(xhr, message, errorData) {
				FLUIGC.toast({
					message : errorData.message,
					type : 'danger'
				});
			}
		}, this.instanceId, preferences);
	},
    
    createModal: function(){
    	var that = this;
    	that.createCard();
    },
    
    deleteCard: function(){
    	var that = this;
    	
    	FLUIGC.message.confirm({
    	    message: 'Deseja enviar o(s) documento(s) selecionado(s) para a lixeira?',
    	    title: 'Remover documento',
    	    labelYes: 'Remover',
    	    labelNo: 'Cancelar'
    	}, function(result, el, ev) {
    		if(result){
    			that.deleteDocument();
    		}
    	});
    },
    
    deleteDocument: function(){
    	var that = this;
    	var row = this.myTable.getRow(this.myTable.selectedRows()[0]);
        
        var nr_ficha = row.documentid;
    	$.ajax({
    		type : "POST",
    		contentType: "application/json",
    		url : '/api/public/2.0/documents/deleteDocument/'+nr_ficha,
    		error: function(e) {
    			FLUIGC.toast({
					title: '',
					message: e.message,
					type: 'danger'
				});
    		},
    		success: function(data){
    			FLUIGC.toast({
					title: '',
					message: "Ficha "+nr_ficha+" removida com sucesso",
					type: 'success'
				});
    			that.loadDadosDataset();
    		},
    	});
    },
    
    createCard: function(){
    	var that = this;
    	
    	ListagemDatasets.loading.show();
    	
    	var nr_fichario = that.nr_fichario;
    	var constraints = this.getAllFormFields();
    	var request_data = {
			"documentDescription": "Criado via widget",
			"parentDocumentId": nr_fichario,
			"version": 1000,
			"inheritSecurity" : true,
			"formData" : constraints,
			"attachments" : []
		};
    	
    	$.ajax({
            type : 'POST',
            dataType : 'json',
            contentType : 'application/json',
            url : '/api/public/2.0/cards/create',
            data : JSON.stringify(request_data),
            success: ListagemDatasets.obj.sucessoAoGravar,
            error : ListagemDatasets.obj.insucessoAoGravar
        });
    	
    },
    
    insucessoAoGravar: function(xhr, status, error) {
    	ListagemDatasets.loading.hide();
    	
    	var response = (!xhr.responseJSON) ? null : xhr.responseJSON.message.message;
        if (!response) try { response = JSON.parse(xhr.responseText) } catch(e) { response = xhr.responseText; }
        FLUIGC.toast({
            message : response,
            type : "danger"
        });
    },
    
    sucessoAoGravar: function(data, status, xhr) {
    	ListagemDatasets.loading.hide();
    	
        if (data) {
        	$("button.close").click();
        	ListagemDatasets.loadDadosDataset();
        }
    },
    
    updateModal: function(){
    	var that = this;
   		that.updateCard();
    },
    
    updateCard : function(){
    	var that = this;
    	
    	ListagemDatasets.loading.show();
    	
    	var nr_ficha = ListagemDatasets.nr_ficha;
    	var nr_versao = ListagemDatasets.nr_versao;
    	var constraints = this.getAllFormFields();
    	
    	var paramData = {
    			"companyId" : WCMAPI.getTenantId(),
    			"documentId" : nr_ficha,
    			"version" : nr_versao,
    			"cardDescription" : "",
    			"documentDescription" : "",
    			"publisherId" : "onboardingapp",
    			"inheritSecurity" : "true",
    			"documentType" : "5",
    			"approved" : "true",
    			"principalFileName" : "",
    			"hasParentApprover" : "false",
    			"permissionType" : 0,
    			"restrictionType" : 0,
    			"userSecurityLevel" : 3,
    			"cardFormData" : constraints
    	}
    	
    	$.ajax({
            type : 'POST',
            dataType : 'json',
            contentType : 'application/json',
            url : '/ecm/api/rest/ecm/cardPublisher/editCard',
            data : JSON.stringify(paramData),
            success : ListagemDatasets.obj.sucessoAoGravar,
            error : ListagemDatasets.obj.insucessoAoGravar
		});
    },
    
    loadDadosDataset: function(){
    	var that = this;
    	var registros_dataset = [];
    	var nm_fichario = that.nm_fichario;
    	var retorno_dataset = [];
    	var limit = "";
    	limit = $("#limite_registros").val();
    	if(limit == "" || limit == undefined){
    		limit = 100;
    	}
    	var url_ajax = "";
    	if(limit != "" && limit != undefined){
    		url_ajax = '/api/public/ecm/dataset/search?datasetId='+nm_fichario+'&likeField=metadata_active,true&limit='+limit;
    	}
    	$.ajax({
    		type: 'GET',
    		async: false,
    		dataType: 'json',
    		url: url_ajax,
    		contentType: 'application/json',
    		success: function(data, status, xhr){
    			if(data != null && data != undefined && data.content.length > 0){
    				var cont = 1;
					var itens = [];
					retorno_dataset = data.content;
					for (var s = 0; s < data.content.length; s++) {
						var nr_ficha = data.content[s].documentid;
						var nr_versao = data.content[s].version;
						
						var registro = {nr_ficha: '', nr_versao: ''};
						registro.nr_ficha = nr_ficha;
						registro.nr_versao = nr_versao;
						registros_dataset.push(registro);
                    }
    			}
    		},
    		error: function(xhr, status, error){
    			FLUIGC.toast({
    				message : "Erro: " + error.message,
    				type: "danger"
    			})
    		}
    	});
    	
    	var campos_tela = (that.camposTela) ? that.camposTela : that.campos_visiveis;
    	var array_campos = new Array();
    	array_campos = campos_tela.split(",");
    	
    	var array_nome_campos = [];
    	
    	var nm_campos_tela = (that.nmCamposTela) ? that.nmCamposTela : that.nm_campos_visiveis;
    	var array_nm_campos = new Array();
    	array_nm_campos = nm_campos_tela.split(",");
	    
    	for(var c = 0;c<array_nm_campos.length;c++){
    		var registro = {"title": array_nm_campos[c]};
			array_nome_campos.push(registro);
    	}
	    that.myTable = FLUIGC.datatable('#dados_dataset', {
	        dataRequest: retorno_dataset,
	        renderContent: array_campos,
	        header: array_nome_campos,
	        ordering: "true",
	        search: {
	            enabled: true,
	            onlyEnterkey: true,
	            searchAreaStyle: 'col-md-3',
	            onSearch: function(res) {
	                	retorno_dataset = [];
						var campo_filtro = $("#sl_filtro_busca option:selected").val();
						var msg = ""
						
						if(campo_filtro.trim() == "" || campo_filtro == null || campo_filtro == undefined){
							msg += 'Erro: Informe o campo "Campo Filtro"</br>'
						}

						if(res.trim() == "" || res == null || res == undefined){
							msg += 'Erro: Informe o campo "Buscar"</br>'
						}
						
						if(msg != ""){
							FLUIGC.toast({
								message : msg,
								type: "danger"
							})

						} else {
							
							var url_ajax = "";						
							url_ajax = '/api/public/ecm/dataset/search?datasetId='+nm_fichario+'&likeField='+campo_filtro+'&likeValue='+res;
							
							$.ajax({
								type: 'GET',
								async: false,
								dataType: 'json',
								url: url_ajax,
								contentType: 'application/json',
								success: function(data, status, xhr){
									if(data != null && data != undefined && data.content.length > 0){
										var cont = 1;
										var itens = [];
										retorno_dataset = data.content;

										for (var s = 0; s < data.content.length; s++) {
											var nr_ficha = data.content[s].documentid;
											var nr_versao = data.content[s].version;
											
											var registro = {nr_ficha: '', nr_versao: ''};
											registro.nr_ficha = nr_ficha;
											registro.nr_versao = nr_versao;
											registros_dataset.push(registro);
										}
									}
								},
								error: function(xhr, status, error){
									FLUIGC.toast({
										message : "Erro: " + error.message,
										type: "danger"
									})
								}
							});
							that.myTable.reload(retorno_dataset);
					}
	            }
	        },
	        actions: {
	            enabled: true,
	            template: '.template_area_buttons',
	            actionAreaStyle: 'col-md-9'
	        },
	        navButtons: {
	            enabled: false,
	        },
	        tableStyle: 'table-striped'
	    }, function(err, data) {
	        if(data) {
	            dataInit = data;
	        }
	        else if (err) {
	            FLUIGC.toast({
	                message: err.message,
	                type: 'danger'
	            });
	        }
	    });
	    
	    $('#fluig-data-table-input').keyup(function() {
        	var campos_tela = that.camposTela;
        	var array_campos = new Array();
        	array_campos = campos_tela.split(",");
        	
        	var array_nome_campos = [];
        	
        	var nm_campos_tela = that.nmCamposTela;
        	var array_nm_campos = new Array();
        	array_nm_campos = nm_campos_tela.split(",");
    	    
        	for(var c = 0;c<array_nm_campos.length;c++){
        		var registro = {"title": array_nm_campos[c]};
    			array_nome_campos.push(registro);
        	}
        	
            var dInput = this.value;
            var dataAll = that.myTable.getData();
            var retorno = [];
            var search = dataInit.filter(function(el) {
            	for(var x=0;x<array_campos.length;x++){
            		var campo = array_campos[x];
            		if(el[array_campos[x]].toString().toUpperCase().indexOf(dInput.toString().toUpperCase()) >= 0){
            			return el;
            		}
            	}
            });
            if (search && search.length) {
                that.myTable.reload(search);
            } else {
                FLUIGC.toast({
                    title: 'Busca: ',
                    message: 'Sem resultados',
                    type: 'success'
                });
            }
        });
	    
		for(var d=0;d<array_campos.length;d++){
			$('#sl_filtro_busca').append($("<option></option>")
		            .attr("value", array_campos[d])
		            .text(array_nm_campos[d])); 
		}
    },
    
    delRow: function(el, ev) {
        var itemsToRemove = this.myTable.selectedRows();
     
        if (itemsToRemove.length > 0) {
            for (var i = 0; i <= itemsToRemove.length; i++) {
                this.myTable.removeRow(this.myTable.selectedRows()[0]);
            }
        }
     
        FLUIGC.toast({
            title: '',
            message: "Removed element",
            type: 'success'
        });
    },
    
    getRow: function(context){
    	var table = context.myTable;
    	var row = table.selectedRows();
    	if(row == null || row.length == 0){
    		table = ListagemDatasets.myTable
    		row = table.selectedRows();
    	}
    	return table.getRow(row[0]);
    },
    
    editRow: function(el, ev) {
        var that = this;
    	var row = ListagemDatasets.getRow(that);
    	var nr_ficha = "";
        var nr_versao = "";
        var nr_fichario = that.nr_fichario;
    	if(row == undefined || row == null){
    		nr_ficha = that.getUrlParameter("nr_ficha");
        	nr_versao = that.getUrlParameter("versao");
    	}else{
    		nr_ficha = row.documentid;
    		let lastVersion = ListagemDatasets.getActiveVersion(nr_ficha);
            nr_versao = (lastVersion == null) ? row.version : lastVersion;
    	}
        
        ListagemDatasets.nr_ficha = nr_ficha;
        ListagemDatasets.nr_versao = nr_versao;
        var companyId = WCMAPI.organizationId;
        var url = "/webdesk/streamcontrol/"+nr_fichario+"/"+nr_ficha+"/"+nr_versao
        	+"/?WDCompanyId="+companyId+"&WDNrDocto="+nr_ficha+"&WDNrVersao="+nr_versao
        	+"&WDParentDocumentId="+nr_fichario+"&edit=true";
    	var myModal = FLUIGC.modal({
    	    title: 'Edição',
    	    content: '<h1>Modal Content</h1>',
    	    id: 'modal_registro',
    	    size: 'full',
    	    actions: [{
    	        'label': 'Salvar',
    	        'bind': 'data-save-modal',
    	    },{
    	        'label': 'Fechar',
    	        'autoClose': true
    	    }]
    	},
    	function(err, data) {
    	    if(err) {
    	        // do error handling
    	    } else {
    	    	$(".modal-body").html('<iframe width="100%" src='+url+' frameborder="0" id="print_frame"></iframe>');
    	    	$("#modal_registro").css("padding",'0px');
   	 	   		$("#modal_registro").css("margin",'0px');
   	 	   		$("#modal_registro .modal-content").css("min-height","100vh");
   	 	   		$("#modal_registro").addClass("width_important");
   	 	   		$("#modal_registro .modal-body").css("min-height","80vh");
   	 	   		$("#modal_registro .modal-body").addClass("no_overflow");
   	 	   		$("#print_frame").css("min-height","85vh");
   	 	   		$("#print_frame").addClass("overflow_auto");
    	    }
    	});
    },
    
    updateRow: function(el, ev) {
        var editedRow = {
            id: $('#datatable-input-id').val(),
            name: $('#datatable-input-name').val(),
            uf: $('#datatable-input-uf').val()
        };
        this.myTable.updateRow(this.myTable.selectedRows()[0], editedRow);
     
        $('[data-datatable-edit-row]').prop("disabled", false);
     
        FLUIGC.toast({
            title: '',
            message: "Edited!",
            type: 'success'
        });
    },
    
    selected: function(el, ev) {
        var index = this.myTable.selectedRows()[0];
        var selected = this.myTable.getRow(index);
        FLUIGC.toast({
            title: '',
            message: "{\"id\" :" + selected.id + ", \"name\" :" + selected.name + " , \"uf\" :" + selected.uf + "}",
            type: 'success'
        });
    },
    
    addRow: function(){
    	var that = this;
    	var nr_fichario = that.nr_fichario;
    	
        var url = "/webdesk/streamcontrol/"+nr_fichario+"/0/0/?WDCompanyId=3&WDNrDocto=0&WDNrVersao=0&WDParentDocumentId="+nr_fichario;
    	
    	var myModal = FLUIGC.modal({
    	    title: 'Inclusão',
    	    content: '<h1>Modal Content</h1>',
    	    id: 'modal_registro_inclusao',
    	    size: 'full',
    	    actions: [{
    	        'label': 'Salvar',
    	        'bind': 'data-save-modal-inclusao',
    	    },{
    	        'label': 'Fechar',
    	        'autoClose': true
    	    }]
    	}, function(err, data) {
    	    if(err) {
    	        // do error handling
    	    } else {
    	    	$(".modal-body").html('<iframe width="100%" src='+url+' frameborder="0" id="print_frame"></iframe>');
    	    	$("#modal_registro_inclusao").css("padding",'0px');
   	 	   		$("#modal_registro_inclusao").css("margin",'0px');
   	 	   		$("#modal_registro_inclusao .modal-content").css("min-height","100vh");
   	 	   		$("#modal_registro_inclusao").addClass("width_important");
   	 	   		$("#modal_registro_inclusao .modal-body").css("min-height","80vh");
   	 	   		$("#modal_registro_inclusao .modal-body").addClass("no_overflow");
   	 	   		$("#print_frame").css("min-height","85vh");
   	 	   		$("#print_frame").addClass("overflow_auto");
    	    }
    	});
    },
    
    returnRadioValue : function(radioName){
		return $("#print_frame").contents().find('input[name='+radioName+']:checked').val() == undefined ? null : $("#print_frame").contents().find('input[name='+radioName+']:checked').val();
	},
	
	returnCheckboxValue : function(checkboxId){
		var iframe = document.getElementById("print_frame");
		return $("#"+checkboxId,iframe.contentWindow.document).prop("checked") == true ? "on" : ""; 
	},
    
    getAllFormFields : function(){
    	var that = this;
    	var constraints = [];
    	
    	var iframe = document.getElementById("print_frame");
    	var elements = iframe.contentWindow.document.querySelectorAll("input[type=text][name],input[type=hidden][name],textarea[name],input[type=datetime-local]")
    	var inputsText = iframe.contentWindow.document.querySelectorAll("input[type=text][name],input[type=hidden][name],textarea[name],input[type=datetime-local],input[type=date");
    	for(var x=0;x<inputsText.length;x++){
    		constraints.push({"name" : inputsText[x].name,	"value" : inputsText[x].value});
    	}
    	
    	var inputsCheckbox = iframe.contentWindow.document.querySelectorAll("input[type=checkbox][name]");
    	for(var y=0;y<inputsCheckbox.length;y++){
    		var value = that.returnCheckboxValue(inputsCheckbox[y].id);
    		constraints.push({"name" : inputsCheckbox[y].name,	"value" : value});
    	}

    	var inputsRadio = iframe.contentWindow.document.querySelectorAll("input[type=radio][name]");
    	for(var z=0;z<inputsRadio.length;z++){
    		var value = that.returnRadioValue(inputsRadio[z].name);
    		var name = inputsRadio[z].name;

    		if(value != null && value != "null" && value != undefined){
    			constraints.push({"name" : name,	"value" : value});
    		}
    	}
    	
    	var selects = iframe.contentWindow.document.querySelectorAll("select");
    	for(var u=0;u<selects.length;u++){
    		var name = selects[u].name;
    		if(selects[u].options[selects[u].selectedIndex] != undefined){
    			var selected1 = [];
    		    for (var i = 0; i < selects[u].length; i++) {
    		        if (selects[u].options[i].selected){
    		        	constraints.push({"name" : name,	"value" : selects[u].options[i].value});
    		        }
    		    }
    		}
    	}
    	return constraints;
    }
	
	, getActiveVersion: function(documentId){
		let companyId = WCMAPI.organizationId;
		let constraints = [
			DatasetFactory.createConstraint('documentPK.companyId', companyId, companyId, ConstraintType.MUST)
			, DatasetFactory.createConstraint('documentPK.documentId', documentId, documentId, ConstraintType.MUST)
			, DatasetFactory.createConstraint('activeVersion', true, true, ConstraintType.MUST)
		];
		let fields = ["documentPK.version"] 
		let dataset = DatasetFactory.getDataset("document", fields, constraints, null);
		if(dataset != null && dataset.values != null && dataset.values.length > 0){
			return dataset.values[0]["documentPK.version"];
		}
		else return null;
	}
});