dychart.js - Dynamic Charts
==========
A plugin that crosses between jQuery UI and Highcharts (with support for Google Charts to come!)

#License
MIT

#Quick Notes (more to come later):

in chartOptions, series need to be defined at least to [{}]
xAxis and yAxis needs to be defined to at least {}

##Quick Breakdown (will update later)
When series.type === 'pie'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [['itemName', count],['itemName2', count]]
			
When series.type === 'column'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'

When series.type === 'line'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'
		
When series.type === 'bar'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'

When series.type === 'scatter'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'
		
When series.type === 'area'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'
		
When series.type === 'areaspline'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'

When series.type === 'spline'

	dynamicType can be:
	
		1. 'replace'
		
			data style = [value, value, value]
			
		2. 'stack'
		
		3. 'assigned'
