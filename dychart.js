(function($, undefined){

	//Global Vars in this scope
	var chart;
	var startColCount = 0;
	var data;
	var datacount = 0;
	var parameters;

	$.fn.dychart = function(params){
		var namespace = $(this).attr('id') + '_dychart';
		data = $.parseJSON(params.data);
		parameters = params;
		if(data != undefined || data != null){
			datacount = data[0].data.length;
		}
		
		//Create datatable
		var $table = $('<table />');
		$table.attr('border', 1);
		$table.attr('id', namespace + "_datatable");

		//Add the headers
		$tr = $('<tr />');
		for(var i = 0; i < data.length; i++){
			$tr.append($('<th />').text(data[i].colname).draggable({revert:true}));
			if(data[i].start){
				startColCount++;
			}
			if(data[i].data.length != datacount){
				console.error("Your data does not all have the same count!");
			}
		}
		$table.append($tr);

		//Add the data
		for(var i = 0; i < datacount; i++){
			$tr = $('<tr />');
			for(var j = 0; j < data.length; j++){
				$tr.append($('<td />').text(data[j].data[i]));
			}
			$table.append($tr);
		}
		$(this).append($table);

		//Droppable Areas
		params.xDroppable.prepend($('<p />').text('XAxis Here')).droppable({
            drop: function( event, ui ) {
            	$(this).find('p').first().html($(ui.draggable).html());
            	drawGraph($(ui.draggable).html());
        	}
        });

		params.yDroppable.prepend($('<p />').text('YAxis Here')).droppable({
            drop: function( event, ui ) {
            	$(this).find('p').first().html($(ui.draggable).html());
        	}
        });

		//Chart
		$(document).ready(function() {
			var series = { series: [{ type: params.chartType, data: getInitialData(params.chartType) }] };
			$.extend(params.chartOptions, series);
        	chart = new Highcharts.Chart(params.chartOptions);
    	});

    	$("#clickdiv").click(function(){
    		var chartOptions2 = {
    			series: [{
                	type: 'pie',
                	data: [
                    	['Firefox',   1.0],
                    	['IE',       26.8],
                    	{
                        	name: 'Chrome',
                        	y: 12.8,
                        	sliced: true,
                        	selected: true
                    	},
                    	['Safari',    8.5],
                    	['Opera',     6.2],
                    	['Others',   0.7]
                	]
            	}]
    		};

    		$.extend(params.chartOptions,chartOptions2);

    		chart.destroy();
    		$(document).ready(function() {
        		chart = new Highcharts.Chart(params.chartOptions);
    		});
    	});
	};
	

	function getInitialData(chartType){
		if(chartType === 'pie'){
			if(startColCount === 1 ){
				for(var i = 0; i < data.length; i++){
					if(data[i].start){
						var values = data[i].data.slice(0);
						$.unique(values);
						var counts = countValues(values, data[i].data);
						return buildData(values, counts);
					}
				}
			}
			else{
				console.error('function getInitialData(chartType): Your data has too many start columns.');
			}
		}
	}

	function getData(columnData){
		var values = columnData.slice(0);
		$.unique(values);
		console.log(values);
		var counts = countValues(values, columnData);
		return buildData(values, counts);
	}

	function countValues(values, rawData){
		var counts = [];
		for(var i = 0; i < values.length; i++){
			var tempCount = 0;
			for(var j = 0; j < rawData.length; j++){
				if(rawData[j] === values[i]){
					tempCount++;
				}
			}
			counts.push(tempCount);
		}
		return counts;
	}

	function buildData(values, counts){
		var data = [];
		if(values.length === counts.length){
			for(var i = 0; i < values.length; i++){
				var datapoint = [];
				datapoint.push(values[i]);
				datapoint.push(counts[i]);
				data.push(datapoint);
			}
			return data;
		}
		else{
			console.error("function buildData(values, counts): values and counts do not have the same length.");
		}
	}

	function drawGraph(column){
		var hasColumn = false;
		for(var i = 0; i < data.length; i++){
			if(column === data[i].colname){
				hasColumn = true;
				var currentData = getData(data[i].data);
				console.log(currentData);
				var series = { series: [{ type: parameters.chartType, data: currentData }] };
				$.extend(parameters.chartOptions, series);
				chart.destroy();
        		chart = new Highcharts.Chart(parameters.chartOptions);
			}
		}
		if(!hasColumn){
			console.error("function drawGraph(column): column " + column + " does not exist");
		}
	}
	
})(jQuery);