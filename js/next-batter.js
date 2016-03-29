//@codekit-prepend "../bower_components/d3/d3.js"

if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function next_batter() {
  var spreadsheet_key = '',
      config_sheet = '0';

  function my(selection) {

    /* ========== VARIABLES & FUNCTIONS ========== */
    var spreadsheet_url = 'http://crossorigin.me/https://spreadsheets.google.com/tq?key={0}&gid={1}&tqx=out:csv';

    function proc_config(rows){
        var config = {
          'lineup': rows,
          'current': null,
          'next': []
        };
        rows.map(function(elem) {
          if (config.current && next_count > 0) {
            config.next.push(elem.id);
            next_count--;
          }
          if (elem.current.length > 0) {
            config.current = elem.id;
            config.next = [];
            next_count = 3;
          }
        })
        return config
    }

    function draw_ui(config){
      selection.selectAll('div')
          .data(config.next)
        .enter().append('div')
          .text(function(d){return d})
    }

    function data_ready(rows) {
      var config = proc_config(rows);
      console.log(config)
      draw_ui(config);
    }

    /* ============================= */
    /* ========== RUNTIME ========== */
    /* ============================= */

    d3.csv(spreadsheet_url.format(spreadsheet_key, config_sheet), data_ready);
  }

  my.spreadsheet_key = function(value) {
    if (!arguments.length) return spreadsheet_key;
    spreadsheet_key = value;
    return my;
  }
  my.config_sheet = function(value) {
    if (!arguments.length) return config_sheet;
    config_sheet = value;
    return my;
  }

  return my;
}
