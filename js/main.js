//@codekit-prepend "next-batter.js"

document.addEventListener('DOMContentLoaded',function(){
	var obj = next_batter()
		.spreadsheet_key('1OIGgKxrKmDhloWkrgv0QaASCg2rGpLVIewbEnBJwK70')
		.config_sheet('408191810')
		.feed_url('http://crossorigin.me/http://common.onset.freedom.com/feeds/mlbstats/players.php');

	d3.select('.container').call(obj);
});
