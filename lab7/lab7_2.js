function init() {
    const dataset = [23, 45, 12, 67, 34, 89, 54];

    var w = 300;
    var h = 300;
    var padding = 1;

    var outerRadius = w / 2;
    var innerRadius = w / 4;

    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var pie = d3.pie()

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("d", arc)
        .style("fill", function(d, i) {
            return color(i);
        });

    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .text(function(d) {
            return d.data;
        })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.value;
        });

}
window.onload = init;