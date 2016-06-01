
var margin = {top: 30, right: 0, bottom: 10, left: 0},
    width = 900 - margin.left - margin.right,
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

d3.csv("data/parallel_dat.csv", function(error, states) {

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(states[0]).filter(function(d,i) {
    if ( i == 0){
      min_max[i] = states.map(function(p) { return p[d]; });
      return true && (y[d] = d3.scale.ordinal()
        .domain(states.map(function(p) { return p[d]; }))
        .range(d3.range(0, height, (height/51))));
    }
    min_max[i] = d3.extent(states, function(p) { return +p[d]; });
    return true && (y[d] = d3.scale.linear()
        .domain(d3.extent(states, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  // background = p_svg.append("g")
  //     .attr("class", "background")
  //   .selectAll("path")
  //     .data(states)
  //   .enter().append("path")
  //     .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = p_svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(states)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = p_svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
      // .call(d3.behavior.drag()
      //   .origin(function(d) { return {x: x(d)}; })
      //   .on("dragstart", function(d) {
      //     dragging[d] = x(d);
      //     background.attr("visibility", "hidden");
      //   })
      //   .on("drag", function(d) {
      //     dragging[d] = Math.min(width, Math.max(0, d3.event.x));
      //     foreground.attr("d", path);
      //     dimensions.sort(function(a, b) { return position(a) - position(b); });
      //     x.domain(dimensions);
      //     g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
      //   })
      //   .on("dragend", function(d) {
      //     delete dragging[d];
      //     transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
      //     transition(foreground).attr("d", path);
      //     background
      //         .attr("d", path)
      //       .transition()
      //         .delay(500)
      //         .duration(0)
      //         .attr("visibility", null);
      //   }));

  

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .attr("id", function(d, i) { return "axis" + i;})
      .each(function(d, i) { 
        if (i == 0){
          d3.select(this).call(axis.scale(y[d]).orient("right").tickValues(min_max[i]).tickSize(0)); 
        } else {
          d3.select(this).call(axis.scale(y[d]).orient("left").tickValues(min_max[i])); 
        }
      })
    // .append("text")
    //   .style("text-anchor", "middle")
    //   .attr("class", "axis_label")
    //   .attr("y", -9)
    //   .text(function(d) { return d; });

  d3.select("#axis_label_div").selectAll(".axis_label")
      .data(dimensions.reverse()) //REVERSING DIMENSIONS HERE
    .enter().append("div")
    .attr("class", "axis_label")
    .style("width", width/(dimensions.length) + "px") //CHANGE 2 TO BE NUMBER OF AXES
    .html(function(d){ return d;})


  // Add and store a brush for each axis.
  // g.append("g")
  //     .attr("class", "brush")
  //     .each(function(d) {
  //       d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
  //     })
  //   .selectAll("rect")
  //     .attr("x", -8)
  //     .attr("width", 16);
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
