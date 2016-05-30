
function matrix(json) {
  var rows = [];
  nodes = json;
  n = nodes.length;
  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
  });

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  y_scale.domain(d3.range(n));
  x_scale.domain(d3.range(10));

  var super_columns = ["Educational <br/> requirements", " ", " ", " ", "Maximum consecutive <br/> teaching days", " ", "Recommendation <br/> required", " ", "Background check <br/> requirements", " "];
  var super_column_labels = d3.select("#col_names")
    .attr("transform", "translate(0,0)")
    .selectAll(".colLabel")
    .data(super_columns)
      .enter().append("div")
      .style("display", "inline-block")
      .html(function(d) { return d; })
      .style("width", x_scale.rangeBand() + "px")
      .style("height","10px")
      .style("margin-right", "1.5px")

  var columns = ["High school/ GED", "Bachelor's degree", "Teaching certificate", "State-specific tests", "For one<br/>school", "For one<br/>teacher", 
    "District/ Superintendent", "Past<br/>employer", "School", "Thumbprint required"];

  var column_labels = d3.select("#cols")
    .attr("transform", "translate(0,0)")
    .selectAll(".colLabel")
    .data(columns)
      .enter().append("div")
      .style("display", "inline-block")
      .html(function(d) { return d; })
      .attr("class", "colLabel")
      .attr("id", function(d,i) { return "col" + i; })
      .style("width", x_scale.rangeBand() + "px")
      .style("height","20px")
      .style("margin-right", "1.5px")

  var row = svg.selectAll(".row")
      .data(nodes)
    .enter().append("g")
      .attr("id", function(d) { return "row" + d.id; })
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y_scale(i) + ")"; })
      .each(row);

  // row.append("text")
  //     .attr("x", -6)
  //     .attr("y", y.rangeBand() / 2)
  //     .attr("dy", ".32em")
  //     .attr("text-anchor", "end")
  //     .text(function(d) { return d.type_of_auth; });

  function getValArray(obj){
    valArr = [];
    valArr.push(obj.hs_ged == 1 ? 1 : 0);
    valArr.push(obj.bach == 1 ? 1 : 0);
    valArr.push(obj.teacher_cert == 1 ? 1 : 0);
    valArr.push(obj.add_test_req == 1 ? 1 : 0);
    if (obj.consec_day_rec == 1){
      if (obj.teacher_overall == 0){
        valArr.push(0); //overall limit
        valArr.push(1); //per assignment limit
      } else if (obj.teacher_overall == 1){
        valArr.push(1);
        valArr.push(0);
      } else {
        valArr.push(0);
        valArr.push(0);
      }
    } else {
      valArr.push(0);
      valArr.push(0);
    }
    if (obj.recs_req == 1){
      if (obj.rec_src == 0){
        valArr.push(1); //district or superintendent
        valArr.push(0); //past employer
        valArr.push(0); //school
      } else if (obj.rec_src == 1){
        valArr.push(0);
        valArr.push(1);
        valArr.push(0);
      } else if (obj.rec_src == 2){
        valArr.push(0);
        valArr.push(0);
        valArr.push(1);
      } else {
        valArr.push(0);
        valArr.push(0);
        valArr.push(0);
      }
    }
    else {
      valArr.push(0); //district or superintendent 
      valArr.push(0); //past employer
      valArr.push(0); //school
    }
    valArr.push(obj.thumbprint);
    return valArr;
  }
  

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
	  .data(getValArray(d3.select(this).data()[0]))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d,i) { 
          return x_scale(i); 
        })
        .attr("width", x_scale.rangeBand())
        .attr("height", y_scale.rangeBand())
        .style("fill", function(d, i) { 
          if ( 0 <= i && i <= 3){
            return d == 1 ? "#4A4CFF" : "#ECEDFF" ;
          } else if (4 <= i && i <= 5){
            return d == 1 ? "#10FFD1" : "#E7FFFA";
          } else if (6 <= i && i <=7){
            return d == 1 ? "#ACFF21" : "#F6FFE8";
          } else {
            return d == 1 ? "#F2FF21" : "#FDFFE8";
          }
        });
  }

  //initial order
  iorder = [];
  for (i = 0; i < n; i++){
    var vals = getValArray(nodes[i]);
    vals.push(nodes[i].id);
    iorder[i] = vals;
  }

  var orders = {
    0: d3.range(n).sort(function(a, b) { return iorder[b][0] - iorder[a][0]; }),
    1: d3.range(n).sort(function(a, b) { return iorder[b][1] - iorder[a][1]; }),
    2: d3.range(n).sort(function(a, b) { return iorder[b][2] - iorder[a][2]; }),
    3: d3.range(n).sort(function(a, b) { return iorder[b][3] - iorder[a][3]; }),
    4: d3.range(n).sort(function(a, b) { return iorder[b][4] - iorder[a][4]; }),
    5: d3.range(n).sort(function(a, b) { return iorder[b][5] - iorder[a][5]; }),
    6: d3.range(n).sort(function(a, b) { return iorder[b][6] - iorder[a][6]; }),
    7: d3.range(n).sort(function(a, b) { return iorder[b][7] - iorder[a][7]; }),
    8: d3.range(n).sort(function(a, b) { return iorder[b][8] - iorder[a][8]; }),
    9: d3.range(n).sort(function(a, b) { return iorder[b][9] - iorder[a][9]; })

  };

  function order(col){
    y_scale.domain(orders[col]);
    var t = svg.transition().duration(1000);

    t.selectAll(".row")
      .delay(function(d, i) { return y_scale(d.index) * 4; })
      .attr("transform", function(d, i) { return "translate(0," + y_scale(d.index) + ")"; });

  }

  matrix = {}
  matrix.order = order;

  var timeout = setTimeout(function() {}, 1000);
  matrix.timeout = timeout;

  return matrix;

}


function loadJson(json) {
    var mat = matrix(json);

    d3.select("#col0").on("click", function() {
	    mat.order(0);
    });

    d3.select("#col1").on("click", function() {
      mat.order(1);
    });

    d3.select("#col2").on("click", function() {
      mat.order(2);
    });

    d3.select("#col3").on("click", function() {
      mat.order(3);
    });

    d3.select("#col4").on("click", function() {
      mat.order(4);
    });

    d3.select("#col5").on("click", function() {
      mat.order(5);
    });

    d3.select("#col6").on("click", function() {
      mat.order(6);
    });

    d3.select("#col7").on("click", function() {
      mat.order(7);
    });

    d3.select("#col8").on("click", function() {
      mat.order(8);
    });

    d3.select("#col9").on("click", function() {
      mat.order(9);
    });


}
