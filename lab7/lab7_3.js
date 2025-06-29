function init() {
    const dataset = [
        {apple: 5, orange: 10, grapes: 22},
        {apple: 4, orange: 12, grapes: 28},
        {apple: 2, orange: 19, grapes: 32},
        {apple: 7, orange: 23, grapes: 35},
        {apple: 23, orange: 17, grapes: 43},
    ];

    var w = 500;
    var h = 300;
    var padding = 1;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) { return d.apple + d.orange + d.grapes; })])
        .range([h, 0]);

    const stack = d3.stack()
        .keys(["apple", "orange", "grapes"]);
    
    const series = stack(dataset);

    console.log(series);

    var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var groups = svg.selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .style("fill", function(d, i) {
            return color(i);
        });

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    var rects = groups.selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d[1]);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return yScale(d[0]) - yScale(d[1]);
        })
        // Add these mouse event handlers
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
            tooltip.html("Value: " + (d[1] - d[0]))
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        })
        .on("mousemove", function(event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        });

    

}
window.onload = init;