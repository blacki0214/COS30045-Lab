function init() {
        var margin = {top: 60, right: 30, bottom: 50, left: 80},
            w = 900 - margin.left - margin.right,
            h = 500 - margin.top - margin.bottom;
        
        var dataset

        d3.csv("../Unemployment_78-95.csv", function(d) {
            return {
                date : new Date(+d.year, +d.month - 1),
                number: +d.number
            }

        }).then(function(data) {
            dataset = data;

            linechart(dataset);
            console.table(data, ["date", "number"]);
        });

        function linechart(dataset) {
            xScale = d3.scaleTime()
                .domain([
                    d3.min(dataset, function(d) { return d.date; }),
                    d3.max(dataset, function(d) { return d.date; })
                ])
                .range([0, w]);

            yScale = d3.scaleLinear()
                .domain([
                    0,
                    d3.max(dataset, function(d) { return d.number; })
                ])
                .range([h, 0]);

            area = d3.area()
                .x(d => xScale(d.date))
                .y0(h)
                .y1(d => yScale(d.number));
            
            var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);
                
            

            svg.append("path")
                .datum(dataset)
                .attr("d", area)
                .attr("fill", "#6b7785")

            svg.append("g")
                .attr("transform", `translate(0, ${h})`)
                .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%Y-%m")));

            svg.append("g")
                .call(d3.axisLeft(yScale).tickFormat(d3.format(",")));

            svg.append("line")
                .attr("x1", 0)
                .attr("x2", w)
                .attr("y1", yScale(500000))
                .attr("y2", yScale(500000))
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "4,4");

            svg.append("text")
                .attr("x", 10)
                .attr("y", yScale(500000) - 10)
                .attr("fill", "red")
                .style("font-size", "20px")
                .text("Half a million unemployed");

            svg.append("text")
                .attr("x", w / 2)
                .attr("y", h + 40) // Adjust as needed for bottom margin
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Year");
        }
}

window.onload = init;