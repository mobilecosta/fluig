var docsNovosMes = SuperWidget.extend({

    //método iniciado quando a widget é carregada
    init: function() {
    	this.calendario();
    	
    },
    docsNovosMesChart: function(){
    	var chart = FLUIGC.chart('#docsNovosMes',{
    	    id: 'docsNovosMesChart',
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
    	var dataset = this.consulta_kpi_novos_docs_mes();
    	if($('[name="agruparPorNovosMes"]').val() == "assuntos"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.labels.push(dataset.values[i].cdAssunto);
    		value[i] = dataset.values[i].count_et_cdAssunto;
        	
        		
    		}
    	}if($('[name="agruparPorNovosMes"]').val() == "unidades"){
    	for(var i = 0 ; i < dataset.values.length ; i++){
    		data.labels.push(dataset.values[i].idUnidade)	
    		value[i] = dataset.values[i].count_et_idUnidade;
    		
    		}
    	}
    	if($('[name="agruparPorNovosMes"]').val() == "anoMes"){
        	for(var i = 0 ; i < dataset.values.length ; i++){
        		data.labels.push(dataset.values[i].anoMes)	
        		value[i] = dataset.values[i].count_et_anoMes;
        		
        		}
        	}


    	var barChart = chart.bar(data,"");
    },
    
    consulta_kpi_novos_docs_mes : function(){
    	var cs = []
    	
    	          cs.push(DatasetFactory.createConstraint('et.raiz', 91705, 91705, ConstraintType.MUST));
    						
    			if($('[name="agruparPorNovosMes"]').val() == "assuntos"){
    			cs.push(DatasetFactory.createConstraint('groupby_et.cdAssunto', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorNovosMes"]').val() == "unidades"){
    	      cs.push(DatasetFactory.createConstraint('groupby_et.idUnidade', null, null, ConstraintType.MUST));
    			}
    			if($('[name="agruparPorNovosMes"]').val() == "anoMes"){
    	    	      cs.push(DatasetFactory.createConstraint('groupby_et.anoMes', null, null, ConstraintType.MUST));
    	    			}
    			
    			var dataFinal = moment($("#dt_finalNovosMes").val()).format('YYYY-MM-DD');
    	         cs.push(DatasetFactory.createConstraint('dDocumento.dt_criacao',moment($("#dt_inicialNovosMes").val()).format('YYYY-MM-DD'), moment($("#dt_finalNovosMes").val()).format('YYYY-MM-DD'), ConstraintType.MUST));
	
    	return DatasetFactory.getDataset('arquivo_kpi_novos_docs_mes',[],cs,[]);
    },
    	calendario : function(){
    		var mySimpleCalendar = FLUIGC.calendar('#dt_inicialNovosMes');
    		var mySimpleCalendar = FLUIGC.calendar('#dt_finalNovosMes');
    	},	
    //BIND de eventos
    bindings: {
        local: {
            
        },
        global: {
        	"carregarNovosMes":["click_docsNovosMesChart"]
        }
    },
 
    executeAction: function(htmlElement, event) {
    }

});


