// (Heavily) modified code from "Parallel Coordinates" 
// by Jason Davies and Mike Bostock
// https://bl.ocks.org/jasondavies/1341281
// http://bl.ocks.org/mbostock/1341021


var margin = {top: 30, right: 0, bottom: 10, left: 0},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([width, 0], 1),
    y = {},
    dragging = {};

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var p_svg = d3.select("#parallel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


min_max = {}

d3.csv("data/parallel_dat3.csv", function(error, states) {

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(states[0]).filter(function(d,i) {
    if (i == 0){
      min_max[i] = states.map(function(p) { return p[d]; });
      return true && (y[d] = d3.scale.ordinal()
        .domain(states.map(function(p) { return p[d]; }))
        .range(d3.range(0, height, (height/51))));
    }
    min_max[i] = d3.extent(states, function(p) { return +p[d]; });
    if (i == 3){
      return true && (y[d] = d3.scale.linear()
        .domain(d3.extent(states, function(p) { return +p[d]; }))
        .range([0, height]));
    }
    return true && (y[d] = d3.scale.linear()
        .domain(d3.extent(states, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  //Add grey background lines for context.
  background = p_svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path)
      .on('click', highlightState)
      .style("stroke", function(d){return abrv_to_color[d["State"]];});;

  // Add blue foreground lines for focus.
  foreground = p_svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path)
      .on('click', highlightState);
    

  d3.select(".foreground")
    .selectAll("path")
    .each(function(d,i){
      var labels = p_svg.append("g")
        .attr("class", "p_label")
        .attr("id","p_label" + d["State"]);
      for (var dim in d){
        if (dim == "State"){
          continue;
        }
        labels.append("text")
          .text(d[dim])
          .attr("x", x(dim) + 5)
          .attr("y", y[dim](d[dim]))
          .attr("fill", "#4A4CFF")
          .style("font-family", "Roboto-bold")
          .style("text-shadow","0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff");

      }
      labels.attr("display","none");
    });


  // Add a group element for each dimension.
  var g = p_svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .attr("id", function(d, i) { return "axis" + i;})
      .each(function(d, i) { 
        if (i == 0){
          d3.select(this).call(axis.scale(y[d]).orient("right").tickValues(min_max[i]).tickSize(0))
          .selectAll('text')
            .attr("id", function(d){return d;})
            .attr("class", "state"); 
        } else {
          d3.select(this).call(axis.scale(y[d]).orient("left").tickValues(min_max[i])); 
        }
      });

  d3.select('#axis0')
    .selectAll('.state')
    .on('click', highlightState);



  d3.select("#axis_label_div").selectAll(".axis_label")
      .data(dimensions.reverse()) //REVERSING DIMENSIONS HERE
    .enter().append("div")
    .attr("class", "axis_label")
    .style("width", width/(dimensions.length) + "px") //CHANGE 2 TO BE NUMBER OF AXES
    .html(function(d){ return d;})

});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.style("display", function(d) {
    return actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
}
