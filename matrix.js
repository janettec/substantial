
function matrix(json) {
  var rows = [];
  nodes = json.nodes;
  n = nodes.length;
  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
  });

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  y.domain(d3.range(n));
  x.domain(d3.range(10));

  var row = svg.selectAll(".row")
      .data(nodes)
    .enter().append("g")
      .attr("id", function(d) { return "row" + d.id; })
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.type_of_auth; });

  // // var column = svg.selectAll(".column")
  // //     .data(matrix)
  // //   .enter().append("g")
  // //     .attr("id", function(d, i) { return "col"+i; })
  // //     .attr("class", "column")
  // //     .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  // // column.append("line")
  // //     .attr("x1", -width);

  // // column.append("text")
  // //     .attr("x", 6)
  // //     .attr("y", x.rangeBand() / 2)
  // //     .attr("dy", ".32em")
  // //     .attr("text-anchor", "start")
  // //     .text(function(d, i) { return nodes[i].name; });


  function getValArray(obj){
    valArr = [];
    valArr.push(obj.hs_ged);
    valArr.push(obj.bach);
    valArr.push(obj.teacher_cert);
    valArr.push(obj.add_test_req);
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
          return x(i); 
        })
        .attr("width", x.rangeBand())
        .attr("height", y.rangeBand())
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
        // .on("mouseover", mouseover)
        // .on("mouseout", mouseout);
  }

  // function mouseover(p) {
  //   d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
  //   d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
  //     d3.select(this).insert("title").text(nodes[p.y].name + "--" + nodes[p.x].name);
  //     d3.select(this.parentElement)
	 //  .append("rect")
	 //  .attr("class", "highlight")
	 //  .attr("width", width)
	 //  .attr("height", x.rangeBand());
  //     d3.select("#col"+p.x)
	 //  .append("rect")
	 //  .attr("class", "highlight")
	 //  .attr("x", -width)
	 //  .attr("width", width)
	 //  .attr("height", x.rangeBand());
  // }

  // function mouseout(p) {
  //   d3.selectAll("text").classed("active", false);
  //   d3.select(this).select("title").remove();
  //   d3.selectAll(".highlight").remove();
  // }

  // var currentOrder = 'name';

  // function order(value) {
  //  var o = orders[value];
  //  currentOrder = value;

  //  if (typeof o === "function") {
  //   orders[value] = o.call();
  //  }
  //  x.domain(orders[value]);

  //  var t = svg.transition().duration(1500);

  //  t.selectAll(".row")
  //         .delay(function(d, i) { return x(i) * 4; })
  //         .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
  //   .selectAll(".cell")
  //         .delay(function(d) { return x(d.x) * 4; })
  //         .attr("x", function(d) { return x(d.x); });

  //  t.selectAll(".column")
  //         .delay(function(d, i) { return x(i) * 4; })
  //         .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });
  // }


  // matrix.order = order;

  // var timeout = setTimeout(function() {}, 1000);
  // matrix.timeout = timeout;
  
  // return matrix;
}


function loadJson(json) {
    var mat = matrix(json);

    // d3.select("#order").on("change", function() {
	   // mat.order(this.value);
    // });

}
