Draw.loadPlugin(function(ui) {
	
	var div = document.createElement('div');
	div.style.background = Editor.isDarkMode() ? '#2a2a2a' : '#ffffff';
	div.style.border = '1px solid gray';
	div.style.opacity = '0.8';
	div.style.padding = '10px';
	div.style.paddingTop = '0px';
	div.style.width = '20%';
	div.innerHTML = '<p><i>' + mxResources.get('nothingIsSelected') + '</i></p>';}