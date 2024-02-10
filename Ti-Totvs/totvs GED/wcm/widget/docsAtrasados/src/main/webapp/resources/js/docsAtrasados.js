var docsAtrasados = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function() {
    	this.calendario();
    	
    },
    docsAtrasadosChart: function(){
    	var chart = FLUIGC.chart('#docsAtrasados',{
    	    id: 'docsAtrasadosChart',
    	    width: '700',
    	    height: '200',
    	});
       var value = []
    	var data = {
    	            labels : [],
    	            datasets : [{
    	            data : value
    	            }]
    	            
    	};
    	var dataset = this.consulta_kpi_atraso_entrega();
    	if($('[name="agruparPorAtrasados"]').val() == "assuntos"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.labels.push(dataset.values[i].cdAssunto);
    		value[i] = dataset.values[i].count_et_cdAssunto;
        	
        		
    		}
    	}if($('[name="agruparPorAtrasados"]').val() == "unidades"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.labels.push(dataset.values[i].idUnidade)	
    		value[i] = dataset.values[i].count_et_idUnidade;
    		
    		}
    	}
    	if($('[name="agruparPorAtrasados"]').val() == "anoMes"){
        	for(var i = 0 ; i < dataset.values.length ; i++){
        		data.labels.push(dataset.values[i].anoMes)	
        		value[i] = dataset.values[i].count_et_anoMes;
        		
        		}
        	}


    	var barChart = chart.bar(data,"");
    },
    
    consulta_kpi_atraso_entrega : function(){
    	var cs = []
    	
    	          cs.push(DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST));
    						
    			if($('[name="agruparPorAtrasados"]').val() == "assuntos"){
    			cs.push(DatasetFactory.createConstraint('groupby_et.cdAssunto', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorAtrasados"]').val() == "unidades"){
    	      cs.push(DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorAtrasados"]').val() == "anoMes"){
    	    	      cs.push(DatasetFactory.createConstraint('groupby_et.anoMes', null, null, ConstraintType.MUST));
    	    			}
    			
    			var dataFinal = moment($("#dt_finaldocsAtrasados").val()).format('YYYY-MM-DD');
    	         cs.push(DatasetFactory.createConstraint('dDocumento.dt_criacao',moment($("#dt_inicialAtrasados").val()).format('YYYY-MM-DD'), moment($("#dt_finalAtrasados").val()).format('YYYY-MM-DD'), ConstraintType.MUST));
	
    	return DatasetFactory.getDataset('arquivo_kpi_atraso_entrega',[],cs,[]);
    },
    	calendario : function(){
    		var mySimpleCalendar = FLUIGC.calendar('#dt_inicialAtrasados');
    		var mySimpleCalendar = FLUIGC.calendar('#dt_finalAtrasados');
    	},	
    //BIND de eventos
    bindings: {
        local: {
            
        },
        global: {
        	"carregarAtrasados":["click_docsAtrasadosChart"]
        }
    },
 
    executeAction: function(htmlElement, event) {
    }

});





