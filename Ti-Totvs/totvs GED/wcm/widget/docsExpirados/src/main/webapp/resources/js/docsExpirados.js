var docsExpirado = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function() {
    	this.calendario();
    	
    },
    docsExpiradoChart: function(){
    	var chart = FLUIGC.chart('#docsExpirado',{
    	    id: 'docsExpiradoChart',
    	    width: '700',
    	    height: '200',
    	});
       
    	var data = [];
    	var dataset = this.consulta_kpi_expirados();
    	if($('[name="agruparPorExpirado"]').val() == "assuntos"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.push({
    			value: dataset.values[i].count_et_cdAssunto,
    	        label: dataset.values[i].cdAssunto
    		});
    		}
    	}if($('[name="agruparPorExpirado"]').val() == "unidades"){
    	for(var i = 0 ; i < dataset.values.length ; i++){	
    		data.push({
    		    value: dataset.values[i].count_et_idUnidade,
    		    label: dataset.values[i].idUnidade
    		});
    		
    		}
    	}

    	var polarChart = chart.polar(data, "");
    },
    
    consulta_kpi_expirados : function(){
    	var cs = []
    	
    	          cs.push(DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST));
    						
    			if($('[name="agruparPorExpirado"]').val() == "assuntos"){
    			cs.push(DatasetFactory.createConstraint('groupby_et.cdAssunto', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorExpirado"]').val() == "unidades"){
    	      cs.push(DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST));
    			}
    			
    			var dataFinal = moment($("#dt_finalExpirado").val()).format('YYYY-MM-DD');
    	         cs.push(DatasetFactory.createConstraint('dDocumento.dt_criacao',moment($("#dt_inicialExpirado").val()).format('YYYY-MM-DD'), moment($("#dt_finalExpirado").val()).format('YYYY-MM-DD'), ConstraintType.MUST));
	
    	return DatasetFactory.getDataset('arquivo_kpi_expirados',[],cs,[]);
    },
    	calendario : function(){
    		var mySimpleCalendar = FLUIGC.calendar('#dt_inicialExpirado');
    		var mySimpleCalendar = FLUIGC.calendar('#dt_finalExpirado');
    	},	
    //BIND de eventos
    bindings: {
        local: {
            
        },
        global: {
        	"carregarExpirado":["click_docsExpiradoChart"]
        }
    },
 
    executeAction: function(htmlElement, event) {
    }

});


