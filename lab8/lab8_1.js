function init() {
    var w = 900;
        h = 500;
    
        var projection = d3.geoMercator()
            .center([145, -36.5]) // Center on Melbourne
            .scale(2450) // Adjust scale for better visibility
            .translate([w / 2, h / 2]); // Translate to center of SVG   

        var path = d3.geoPath()
            .projection(projection);

        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("fill", "grey");

        d3.json("./LGA_VIC.json").then (function(data) {
            svg.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", "#6b7785")
                .attr("stroke", "black")
                .attr("stroke-width", 0.5);
        });
}

window.onload = init;