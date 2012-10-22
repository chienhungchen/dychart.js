/********
* dychart.js
* Copyright (c) 2012 Chien-Hung Chen
* Github: https://github.com/chienhungchen/dychart.js
* Licensed Under the WTFPL (or MIT if that makes you happier)
********/

(function($, undefined){
	
	/********************
		Params definition:
			data: Holds data
			dynamicType: 'replace', 'stack', 'assigned'
			chartOptions: passes in HighChart options into the plugin
			xDroppable: Variables regarding the area on which we will be dropping the "x-axis"
				target: the jQuery object on which to operate on
				onStartText: default string to put into the area to start
				onDropText: pass in a function on which you can decide how you want to format your dropped column name
			axisCount: # of axis
	********************/
	
	//Global vars in this scope
	var chart;
	var startColCount = 0;
	var _DATA, _CHARTTYPE; //global data
	var _DATACOUNT = 0;
	var _REPLACE = 'replace', _STACK = 'stack', _ASSIGNED = 'assigned'; //Assigning these as global strings to aid changes
	var _PT = { pie:'pie', column:'column', bar:'bar',
				area:'area', areaspline:'areaspline',
				line:'line', scatter:'scatter', spline:'spline'};

	$.fn.dychart = function(params){
		_DATA = $.parseJSON(params.data);
		if(_DATA != undefined || _DATA != null){ _DATACOUNT = _DATA[0].data.length; }
		_CHARTTYPE = params.chartOptions.series[0].type;
		if(_CHARTTYPE === undefined || _CHARTTYPE === null || _CHARTTYPE === ''){
			_CHARTTYPE = params.chartOptions.chart.type;
			if(_CHARTTYPE === undefined || _CHARTTYPE === null || _CHARTTYPE === ''){
				console.error('Chart type not specified in chartOptions.');
			}
		}

		//Build Table
		$tr = $('<tr />');
		for(var i = 0; i < _DATA.length; i++){
			$th = $('<th />').text(_DATA[i].colname);
			if(_DATA[i].chartable){
				$th.draggable({revert:true}).attr('class', 'chartable');
			}
			$tr.append($th);
			if(_DATA[i].start){
				startColCount++;
			}
			if(_DATA[i].data.length != _DATACOUNT){
				console.error("Your data does not all have the same count!");
			}
		}
		$(this).append($tr);

		for(var i = 0; i < _DATACOUNT; i++){
			$tr = $('<tr />');
			for(var j = 0; j < _DATA.length; j++){
				$tr.append($('<td />').text(_DATA[j].data[i]));
			}
			$(this).append($tr);
		}
		//Build Table END
		
		//Droppable Areas
		if(params.xDroppable != undefined){
			params.xDroppable.target.prepend($('<p />').text((params.xDroppable.onStartText != undefined) ? params.xDroppable.onStartText : 'XAxis Here')).droppable({
            	drop: function( event, ui ) {
            		var dropText = (params.xDroppable.onDropText != undefined) ? params.xDroppable.onDropText($(ui.draggable).html()) : $(ui.draggable).html();
            		$(this).find('p').first().html(dropText);
					if(params.dynamicType === 'pie'){
	            		drawGraph($(ui.draggable).html(), params);
					}
					if(params.dynamicType === 'column'){
						drawGraph($(ui.draggable).html(), params);
					}
					if(params.dynamicType === _REPLACE){
						drawGraph($(ui.draggable).html(), params);
					}
        		}
        	});
		}
		if(params.yDroppable != undefined){
			params.yDroppable.target.prepend($('<p />').text((params.xDroppable.onStartText != undefined) ? params.xDroppable.onStartText : 'YAxis Here')).droppable({
            	drop: function( event, ui ) {
            		var dropText = (params.xDroppable.onDropText != undefined) ? params.xDroppable.onDropText($(ui.draggable).html()) : $(ui.draggable).html();
            		$(this).find('p').first().html(dropText);
        		}
        	});
		}
		
		//Chart
		$(document).ready(function() {
			var initialData, series, xAxis, yAxis;
			if(params.dynamicType === _REPLACE){
				switch(_CHARTTYPE){
					case _PT.pie:
						$.extend(params.chartOptions.series[0], {data: getInitialData(params.dynamicType, _CHARTTYPE)});
						break;
					case _PT.column: case _PT.line: case _PT.bar: case _PT.spline:
					case _PT.scatter: case _PT.area: case _PT.areaspline:
						initialData = getInitialData(params.dynamicType, _CHARTTYPE);
						$.extend(params.chartOptions.xAxis, initialData.xData);
						if(params.chartOptions.yAxis.title){
							$.extend(params.chartOptions.yAxis.title, {text: initialData.yData.colname});
						}
						else{
							$.extend(params.chartOptions.yAxis, {title: {text: initialData.yData.colname}});
						}
						$.extend(params.chartOptions.series[0], {data: initialData.yData.data, name: initialData.yData.colname});
						break;
					default:
						console.log('Chart type:' + _CHARTTYPE + ' not recognized');
				}
			}
			console.log(params.chartOptions)
        	chart = new Highcharts.Chart(params.chartOptions);
    	});
	};
	

	function getInitialData(dynamicType, chartType){
		if(dynamicType === _REPLACE){
			if(chartType === _PT.pie){
				for(var i = 0; i < _DATA.length; i++){
					if(_DATA[i].start){
						return getData(_DATA[i].data);
					}
				}
			}
			else if(chartType === _PT.column || chartType === _PT.line || chartType === _PT.bar || chartType === _PT.scatter
				|| chartType === _PT.area || chartType === _PT.areaspline || chartType === _PT.spline){
				var startData = {};
				for(var i = 0; i < _DATA.length; i++){
					if(_DATA[i].start && _DATA[i].axis === "x"){
						$.extend(startData, {xData : { categories : _DATA[i].data}});
					}
					else if(_DATA[i].start && _DATA[i].axis === "y"){
						$.extend(startData, {yData : _DATA[i]});
					}
				}
				return startData;
			}
		}
		else{
			console.error('function getInitialData: dynamicType not recognized.');
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

	function drawGraph(columnName, params){
		var hasColumn = false;
		for(var i = 0; i < _DATA.length; i++){
			if(columnName === _DATA[i].colname){
				hasColumn = true;
				if(params.dynamicType === _REPLACE){
					switch(_CHARTTYPE){
						case _PT.pie:
							$.extend(params.chartOptions.series[0], {data: getData(_DATA[i].data)});
							break;
						case _PT.column: case _PT.line: case _PT.bar: case _PT.spline:
						case _PT.scatter: case _PT.area: case _PT.areaspline:
							$.extend(params.chartOptions.yAxis.title, {text: _DATA[i].colname});
							$.extend(params.chartOptions.series[0], {data: _DATA[i].data, name: _DATA[i].colname});
							break;
						default:
							console.error('function drawGraph: chart type not recognized.');
					}
				}
				chart.destroy();
        		chart = new Highcharts.Chart(params.chartOptions);
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