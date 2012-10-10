(function($, undefined){

	//Global vars in this scope
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

		//Add the headers
		$tr = $('<tr />');
		for(var i = 0; i < data.length; i++){
			$th = $('<th />').text(data[i].colname);
			if(data[i].chartable){
				$th.draggable({revert:true});
			}
			$tr.append($th);
			if(data[i].start){
				startColCount++;
			}
			if(data[i].data.length != datacount){
				console.error("Your data does not all have the same count!");
			}
		}
		params.tableElement.append($tr);

		//Add the data
		for(var i = 0; i < datacount; i++){
			$tr = $('<tr />');
			for(var j = 0; j < data.length; j++){
				$tr.append($('<td />').text(data[j].data[i]));
			}
			params.tableElement.append($tr);
		}

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
	};
	

	function getInitialData(chartType){
		if(chartType === 'pie'){
			if(startColCount === 1 ){
				for(var i = 0; i < data.length; i++){
					if(data[i].start){
						var values = data[i].data.slice(0);
						values = unique(values);
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
		values = unique(values);
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
				datapoint.push(String(values[i]));
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

	function unique(array){
		returnArr = [], exist = false;
		for(var i = 0; i < array.length; i++){
			for(var j = 0; j < returnArr.length; j++){
				if(array[i] === returnArr[j]){
					exist = true;
				}
			}
			if(!exist){
				returnArr.push(array[i]);
			}
			exist = false;
		}
		return returnArr;
	}	
})(jQuery);