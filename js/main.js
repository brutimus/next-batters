//@codekit-prepend "next-batter.js"

document.addEventListener('DOMContentLoaded',function(){
	var obj = next_batter()
		.spreadsheet_key('1OIGgKxrKmDhloWkrgv0QaASCg2rGpLVIewbEnBJwK70')
	    .config_sheet('0');

	d3.select('.container').call(obj);
});
