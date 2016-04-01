//@codekit-prepend "next-batter.js"

document.addEventListener('DOMContentLoaded',function(){
	var obj = next_batter()
		.spreadsheet_key('1OIGgKxrKmDhloWkrgv0QaASCg2rGpLVIewbEnBJwK70')
		.config_sheet('0')
		.feed_url('http://crossorigin.me/http://files.onset.freedom.com/ocregister/inc/test/angels.json');

	d3.select('.container').call(obj);
});
