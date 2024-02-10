var docsRevalidados = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function() {
    	this.calendario();
    	
    },
    docsRevalidadoChart: function(){
    	var chart = FLUIGC.chart('#docsRevalidado', {
    	    id: 'docsRevalidadoChart',
    	    width: '700',
    	    height: '200',
    	});
       
    	var data = [];
    	var dataset = this.consulta_kpi_revalidados();
    	if($('[name="agruparPorRevalidado"]').val() == "assuntos"){
    	for(var i = 0 ; i < dataset.values.length ; i++){data.push({
    			value: dataset.values[i].count_et_cdAssunto,
    	        label: dataset.values[i].cdAssunto
    		});
    		}
    	}if($('[name="agruparPorRevalidado"]').val() == "unidades"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.push({
    		    value: dataset.values[i].count_et_idUnidade,
    		    label: dataset.values[i].idUnidade
    		});
    		}
    	}

    	var polarChart = chart.polar(data, "");
    },
    
    consulta_kpi_revalidados : function(){
    	var cs = []
    	
    	          cs.push(DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST));
    						
    			if($('[name="agruparPorRevalidado"]').val() == "assuntos"){
    			cs.push(DatasetFactory.createConstraint('groupby_et.cdAssunto', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorRevalidado"]').val() == "unidades"){
    	      cs.push(DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST));
    			}
    			
    			var dataFinal = moment($("#dt_finalRevalidado").val()).format('YYYY-MM-DD');
    	         cs.push(DatasetFactory.createConstraint('et.dtPrevista',moment($("#dt_inicialRevalidado").val()).format('YYYY-MM-DD'), moment($("#dt_finalRevalidado").val()).format('YYYY-MM-DD'), ConstraintType.MUST));
	
    	return DatasetFactory.getDataset('arquivo_kpi_revalidados',[],cs,[]);
    },
    	calendario : function(){
    		var mySimpleCalendar = FLUIGC.calendar('#dt_inicialRevalidado');
    		var mySimpleCalendar = FLUIGC.calendar('#dt_finalRevalidado');
    	},	
    //BIND de eventos
    bindings: {
        local: {
            
        },
        global: {
        	"carregarRevalidado":["click_docsRevalidadoChart"]
        }
    },
 
    executeAction: function(htmlElement, event) {
    }

});

