(function($, undefined){
	$.fn.dychart = function(dataString){
		var namespace = $(this).attr('id') + '_dychart';
		var data = $.parseJSON(dataString.data);
		var datacount;
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
			$th = $('<th />');
			$th.text(data[i].colname);
			$th.draggable({revert:true});
			$tr.append($th);
			if(data[i].data.length != datacount){
				console.error("Your data does not all have the same count!");
			}
		}
		$table.append($tr);

		//Add the data
		for(var i = 0; i < datacount; i++){
			$tr = $('<tr />');
			for(var j = 0; j < data.length; j++){
				$td = $('<td />');
				$td.text(data[j].data[i]);
				$tr.append($td);
			}
			$table.append($tr);
		}

		$(this).append($table);
	};
	
	var chart;
	
	$(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            series: [{
                type: 'pie',
                name: 'Test',
                data: [
                    ['Firefox',   45.0],
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
        });
    });
})(jQuery);