function init() {
            var w = 500;
        var h = 100;
        padding = 1;

        d3.csv("task2_4.csv").then(function(data){

            console.log(data);
            wombatSightings = data;

            barChart(wombatSightings);

        });

        function barChart() {
            var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

            var bar_width = (w / wombatSightings.length) - padding;

            svg.selectAll("rect")
                .data(wombatSightings)
                .enter()
                .append("rect")
                .attr("x", function(d, i) {
                    return i * (w / wombatSightings.length);
                })
                .attr("y", function(d) {
                    return h - (d.wombats * 4);
                })
                .attr("width", bar_width)
                .attr("height", function(d) {
                    return Number(d.wombats) * 4;
                })
                .attr("fill", function(d) {
                    return d.wombats > 10 ? "blue" : "darkblue";  // Highlight points with y > 10
                })
                
        }
}
window.onload = init;