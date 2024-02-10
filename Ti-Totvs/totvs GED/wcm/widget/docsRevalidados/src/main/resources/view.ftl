<div id="docsRevalidados_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="docsRevalidados.instance()">
	<link rel="stylesheet" type="text/css" href="/style-guide/css/fluig-style-guide-filter.min.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.21.0/moment.min.js"></script>	
	<script src="/style-guide/js/fluig-style-guide-filter.min.js"></script>
	<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
	<div class="row">
		<div class=col-md-3>
			<label>Agrupar por: </label>
				<select name="agruparPorRevalidado">
				  <option value="assuntos">Assuntos</option>
				  <option value="unidades">Unidades</option>
				  <option value="anoMes">Ano-Mês</option>
				</select>
			</div>
		<form>	
				<div class=col-md-4>		
					<label>Data Inicial</label>
					<input name="dt_inicialRevalidado" type="text" id="dt_inicialRevalidado" required>
				</div>
				<div class=col-md-3>		
					<label>Data Final  </label>
					<input name="dt_finalRevalidado" type="text" id="dt_finalRevalidado" required="true">
				</div>
				<div class="col-md-1">
				<input data-carregarRevalidado type="submit"/>
				</div>
				</form>	
			</div>
			<div class="row">
				<div class="col-md-12">	
			<div id="docsRevalidado"></div>
				</div>
			</div>		
</div>


