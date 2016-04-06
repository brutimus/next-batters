//@codekit-prepend "../bower_components/d3/d3.js"
//@codekit-prepend "../bower_components/queue-async/d3-queue.js"

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

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

d3.f = function(){
    var functions = arguments;
    //convert all string arguments into field accessors
    var i = 0, l = functions.length;
    while (i < l) {
        if (typeof(functions[i]) === 'string' || typeof(functions[i]) === 'number'){
            functions[i] = (function(str){ return function(d){ return d[str] }; })(functions[i])
        }
        i++;
    }
     //return composition of functions
    return function(d) {
        var i=0, l = functions.length;
        while (i++ < l) d = functions[i-1].call(this, d);
        return d;
    };
};
// store d3.f as convenient unicode character function (alt-f on macs)
if (typeof window !== 'undefined' && !window.hasOwnProperty('ƒ')) window.ƒ = d3.f;

function next_batter() {
  var spreadsheet_key = '',
      config_sheet = '0',
      feed_url = '';

  function my(selection) {

    /* ========== VARIABLES & FUNCTIONS ========== */
    var spreadsheet_url = 'http://crossorigin.me/https://spreadsheets.google.com/tq?key={0}&gid={1}&tqx=out:csv';

    function proc_config(rows){
        var config = {
          'lineup': rows,
          'current': null,
          'next': []
        };
        while (true) {
          rows.map(function(elem) {
            if (config.current && next_count > 0) {
              config.next.push(elem);
              next_count--;
            }
            if (elem.current.length > 0 && config.next.length == 0) {
              config.current = elem;
              config.next = [];
              next_count = 3;
            }
          })
          if (next_count <= 0) {
            return config
          }
        }
    }

    function proc_feed(data) {
      return data.players.reduce(function (o, v) {
        o[v.playerId] = v
        return o
      }, {})
    }

    function draw_ui(config, roster){
      var div = selection.selectAll('div')
        .data(config.next)
        .enter()
          .append('div')
          .classed('player', true);
      var l_div = div.append('div')
        .classed('left-side', true);
      l_div.append('img')
        .attr('src', function (d) {return d.photo})
        .classed('photo', true);
      l_div.append('a')
        .attr('href', function(d){return 'http://m.ocregister.com/Sports/Angels/Player?thePlayer=' + d.playerId})
        .attr('target', '_parent')
        .html('Full Profile &raquo;');
      var r_div = div.append('div')
        .classed('right-side', true);
      r_div.append('p')
        .classed('name', true)
        .text(function (d) {
          return d.firstName + ' ' + d.lastName + ', ' + d.uniform
        });
      r_div.append('p')
        .classed('pos', true)
        .text(function(d){
          return 'Position(s): ' + d.positions.map(function(p, i){
            return p.abbreviation + ((i + 1) < d.positions.length ? ', ' : '')
          })
        });
      r_div.append('p')
        .classed('bt', true)
        .text(function (d) {
          return 'Bats/Throws: ' + d.batSide[0] + '/' + d.throwingHand[0]
        });
      r_div.append('span')
        .classed('stats', true)
        .html(function(d){return ("<table>" +
        "<thead><tr><th></th><th>SEASON</th><th>CAREER</th></tr></thead><tbody>" +
        "<tr><td>Avg</td><td>{0}</td><td>{4}</td></tr>" +
        "<tr><td>Runs</td><td>{1}</td><td>{5}</td></tr>" +
        "<tr><td>HR</td><td>{2}</td><td>{6}</td></tr>" +
        "<tr><td>RBI</td><td>{3}</td><td>{7}</td></tr>" +
        "</tbody></table>").format(
          d.seasonStats.batting.avg != null ? d.seasonStats.batting.avg : '-',
          d.seasonStats.batting.runs,
          d.seasonStats.batting.hr,
          d.seasonStats.batting.rbi,
          d.careerStats.batting.avg != null ? d.careerStats.batting.avg : '-',
          d.careerStats.batting.runs,
          d.careerStats.batting.hr,
          d.careerStats.batting.rbi
        )})
    }

    function data_ready(err, spreadsheet_data, feed_data) {
      var config = proc_config(spreadsheet_data);
      var roster = proc_feed(feed_data);
      config.next.map(function (row) {
        // console.log(row);
        extend(row, roster[row.id])
      })
      // console.log(config, roster);
      draw_ui(config);
    }

    /* ============================= */
    /* ========== RUNTIME ========== */
    /* ============================= */

    d3_queue.queue()
        .defer(d3.csv, spreadsheet_url.format(spreadsheet_key, config_sheet))
        .defer(d3.json, feed_url)
        .await(data_ready);
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
  my.feed_url = function(value) {
    if (!arguments.length) return feed_url;
    feed_url = value;
    return my;
  }

  return my;
}
