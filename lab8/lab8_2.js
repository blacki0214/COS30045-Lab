function init() {
  var w = 900;
  h = 500;

  var colorScale = d3.scaleQuantize().range(d3.schemePurples[9]);

  var projection = d3
    .geoMercator()
    .center([145, -36.5]) // Center on Melbourne
    .scale(2450) // Adjust scale for better visibility
    .translate([w / 2, h / 2]); // Translate to center of SVG

  var path = d3.geoPath().projection(projection);

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
    
  // Add title
  svg.append("text")
    .attr("x", w / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .text("Victorian Number Unemployed by LGA");

  // Load both data files
  Promise.all([
    d3.csv("./VIC_LGA_unemployment.csv"),
    d3.json("./LGA_VIC.json")
  ]).then(function(values) {
    var unemploymentData = values[0];
    var mapData = values[1];
    
    // Set color domain based on unemployment data
    colorScale.domain([
      d3.min(unemploymentData, function(d) { return +d.unemployed; }),
      d3.max(unemploymentData, function(d) { return +d.unemployed; })
    ]);
    
    // Merge the unemployment data and GeoJSON
    // Loop through once for each unemployment data value
    for (var i = 0; i < unemploymentData.length; i++) {
      // Grab LGA name
      var dataLGA = unemploymentData[i].LGA;
      
      // Grab unemployment value and convert from string to number
      var dataValue = parseFloat(unemploymentData[i].unemployed);
      
      // Find the corresponding LGA inside the GeoJSON
      for (var j = 0; j < mapData.features.length; j++) {
        var jsonLGA = mapData.features[j].properties.LGA_name;
        
        if (dataLGA == jsonLGA) {
          // Copy the unemployment value into the JSON
          mapData.features[j].properties.unemployed = dataValue;
          
          // Stop looking through the JSON
          break;
        }
      }
    }
    
    // Draw map with color encoding
    svg.selectAll("path")
       .data(mapData.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("fill", function(d) {
         // Get unemployment value for this LGA
         var value = d.properties.unemployed;
         return value ? colorScale(value) : "#ccc"; // Gray for missing data
       })
       .attr("stroke", "black")
       .attr("stroke-width", 0.5);
       
    // Load city data
    d3.csv("./VIC_city.csv").then(function(cityData) {
      // Add circles for cities/towns
      svg.selectAll("circle")
         .data(cityData)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
           return projection([+d.lon, +d.lat])[0];
         })
         .attr("cy", function(d) {
           return projection([+d.lon, +d.lat])[1];
         })
         .attr("r", 4)
         .attr("fill", "red")
         .attr("stroke", "black")
         .attr("stroke-width", 1);

      // Add city labels
      svg.selectAll("text.city")
         .data(cityData)
         .enter()
         .append("text")
         .attr("class", "city")
         .attr("x", function(d) {
           return projection([+d.lon, +d.lat])[0] + 7;
         })
         .attr("y", function(d) {
           return projection([+d.lon, +d.lat])[1];
         })
         .text(function(d) {
           return d.place;
         })
         .attr("font-family", "sans-serif")
         .attr("font-size", "10px")
         .attr("fill", "black");
    });
  });
}

window.onload = init;