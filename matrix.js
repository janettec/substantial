
function matrix(json) {
  var rows = [],
      nodes = json,
      n = nodes.length;

  // Compute index per node.
  nodes.forEach(function(node, i) {
    node.index = i;
  });

  svg.append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height);

  var row = svg.selectAll(".row")
      .data(nodes)
    .enter().append("g")
      .attr("id", function(d) { return "row" + d.id; })
      .attr("class", "row")
      .attr("transform", function(d, i) { return "translate(0," + x(i) + ")"; })
      .each(row);

  row.append("line")
      .attr("x2", width);

  row.append("text")
      .attr("x", -6)
      .attr("y", x.rangeBand() / 2)
      .attr("dy", ".32em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.type_of_auth; });

  // var column = svg.selectAll(".column")
  //     .data(matrix)
  //   .enter().append("g")
  //     .attr("id", function(d, i) { return "col"+i; })
  //     .attr("class", "column")
  //     .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

  // column.append("line")
  //     .attr("x1", -width);

  // column.append("text")
  //     .attr("x", 6)
  //     .attr("y", x.rangeBand() / 2)
  //     .attr("dy", ".32em")
  //     .attr("text-anchor", "start")
  //     .text(function(d, i) { return nodes[i].name; });

  function row(row) {
    var cell = d3.select(this).selectAll(".cell")
	  .data(row.filter(function(d) { 
      return d.z; 
    }))
      .enter().append("rect")
        .attr("class", "cell")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("height", x.rangeBand())
        .style("fill-opacity", function(d) { return z(d.z); })
        .style("fill", function(d) { return nodes[d.x].group == nodes[d.y].group ? c(nodes[d.x].group) : null; })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
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

    d3.select("#order").on("change", function() {
	   mat.order(this.value);
    });

}
