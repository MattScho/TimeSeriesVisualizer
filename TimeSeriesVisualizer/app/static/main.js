var margin = {top: 50, right: 30, bottom: 30, left: 10};

/*
* Builds confusion matrix for model performance
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/22/2020
*/
function Matrix(options) {
    var width = 180,
        height = 180,
        data = options.data,
        container = options.container,
        labelsData = options.labels,
        startColor = options.start_color,
        endColor = options.end_color;

    var widthLegend = 100;
    var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
    var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });
    var numrows = data.length;
    var numcols = data[0].length;
    var svg = d3.select(container).append("svg")
        .attr("width", width + margin.left  + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom+100)
        .append("g")
        .attr("transform", "translate(" + margin.left/0.2 + "," + margin.top + ")");
    var background = svg.append("rect")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("width", width)
        .attr("height", height);
    var x = d3.scaleBand()
        .domain(d3.range(numcols))
        .range([0, width]);
    var y = d3.scaleBand()
        .domain(d3.range(numrows))
        .range([0, height]);
    var colorMap = d3.scaleLinear()
        .domain([minValue,maxValue])
        .range([startColor, endColor]);
    var row = svg.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
    var cell = row.selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });
    cell.append('rect')
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("stroke-width", 0);
    cell.append("text")
        .attr("dy", ".32em")
        .attr("x", x.bandwidth() / 2)
        .attr("y", y.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
        .text(function(d, i) { return d; });
    row.selectAll(".cell")
        .data(function(d, i) { return data[i]; })
        .style("fill", colorMap);
    var labels = svg.append('g')
        .attr('class', "labels");
    var columnLabels = labels.selectAll(".column-label")
        .data(labelsData)
        .enter().append("g")
        .attr("class", "column-label")
        .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });

    columnLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", x.bandwidth() / 2)
        .attr("x2", x.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", 5);

    columnLabels.append("text")
        .attr("x", 3)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".22em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-60)")
        .text(function(d, i) { return d; });

    var rowLabels = labels.selectAll(".row-label")
        .data(labelsData)
        .enter().append("g")
        .attr("class", "row-label")
        .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });
    rowLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", 0)
        .attr("x2", -5)
        .attr("y1", y.bandwidth() / 2)
        .attr("y2", y.bandwidth() / 2);

    rowLabels.append("text")
        .attr("x", -20)
        .attr("y", y.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d; });

    svg.append("text")
        .attr("y",-110)
        .attr("x", -20)
        .attr("dx", -40)
        .attr("font-size", "16px")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "bold")
        .attr("fill", "green")
        .text("Actual Class")
        ;
    svg.append("text")
        .attr("y",height+80)
        .attr("x", width/2)
        .attr("dx",10)
        .attr("font-size", "15px")
        .attr("text-anchor", "middle")
        .attr("font-weight", "bold")
        .attr("fill", "red")
        .text("Predicted Class");

    /*var key = d3.select("#legend")
        .append("svg")
        .attr("width", width + margin.left  + margin.right + 500)
        .attr("height", height + margin.top + margin.bottom + 500);*/

  var legend = svg
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

  legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", endColor)
        .attr("stop-opacity", 1);

  legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", startColor)
        .attr("stop-opacity", 1);

  svg.append("rect")
        .attr("width", widthLegend/3-10)
        .attr("height", height)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(200,0)");

  var y = d3.scaleLinear()
        .range([height, 0])
        .domain([minValue, maxValue]);

  var yAxis = d3.axisRight(y);
  svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(230,0)")
        .call(yAxis);

}
/*
* Generates confusion matrix for model performance
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/22/2020
*/
function confusionMatrix (d) {

    d3.json("/static/data/timeSeries.json").then(function(data) {
        var mapper = {};
        for(var label in labels)
        {
            mapper[labels[label]] = {};
            for(var labelInner in labels)
            {
                mapper[labels[label]][labels[labelInner]] = 0;
            }
        }
        data.forEach(function (d) {
            mapper[d.label][d.predicted] += 1;
        })
        var confusionMatrix = []
        for(var label in labels)
        {
            temp = []
            for(var labelInner in labels)
            {
                temp.push(mapper[labels[label]][labels[labelInner]]);
            }
            confusionMatrix.push(temp)
        }

        confusionMatrix = [
            [49, 0, 0, 2, 0, 0, 0, 0],
            [0, 129, 4, 5, 2, 5, 1, 1],
            [0, 1, 170, 1, 1, 4, 0, 0],
            [0, 3, 2, 126, 2, 4, 2, 2],
            [0, 6, 1, 5, 117, 3, 0, 1],
            [0, 7, 0, 6, 2, 135, 0, 5],
            [0, 3, 0, 0, 0, 2, 128, 2],
            [0, 6, 2, 2, 3, 1, 4, 120]
        ]
        var options = '#performanceViewPanel';
        Matrix({
            container: '#performanceViewPanel',
            data: confusionMatrix,
            labels: labels,
            start_color: '#ffffff',
            end_color: '#2e184a'
        });

        for(label in labels)
        {
            strLabel = labels[label];
            var TP = mapper[strLabel][strLabel];
            var FP = 0;
            var TN = 0;
            var FN = 0;

            for(otherLabel in labels)
            {
                strOtherLabel = labels[otherLabel];
                if(strOtherLabel != strLabel)
                {
                    FP += mapper[strOtherLabel][strLabel];
                    FN += mapper[strLabel][strOtherLabel];
                    for(_otherLabel in labels)
                    {
                        str_otherLabel = labels[_otherLabel];
                        if(str_otherLabel != strLabel)
                        {
                            TN += mapper[str_otherLabel][strOtherLabel];
                        }
                    }
                }
            }
            var labelArr = [strLabel, 'N'];
            Matrix({
                container: '#performanceViewPanel',
                data: [[TP, FN],[FP, TN]],
                labels: labelArr,
                start_color: '#ffffff',
                end_color: '#2e184a'
            });


        }
    })
}

var margin = {top:70, right:50, bottom:40, left:30},
    width = 300 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var y = d3.scaleLinear()
    .range([height, 0]);


/*
* Showcases the variability metric
*
* Author: Matthew Schofield, Gulsum Alicioglu
* Version: 4/22/2020
*/
function variability(d) {
    d3.json("/static/data/timeSeries.json").then(function(data) {
        data.forEach(function (d) {
            var x = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width]);
            x.domain(d3.extent(data, function (d) {
                return d.variability;
            }));
            // set parameters for histogram
            var histogram = d3.histogram()
                .value(function (d) {
                    return d.variability;})
                .domain(x.domain())
                .thresholds(x.ticks(10))
            ;
            var nest = d3.nest()
                .key(function (d) {
                    return d.label;})
                .entries(data);
            var malw = nest.map(function (d) {
                return {
                    key: d.key,
                    values: histogram(d.values)
                }
            });
            y.domain([0, 400]);
            var svg = d3.select("#variabilityViewPanel").selectAll("svg")
                .data(malw)
                .enter()
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            svg.append("text")
                .attr("class", "label")
                .attr("x", margin.left)
                .attr("y", margin.top/2)
                .attr("font-size", "1em")
                .text(function(d) { return d.key; });
            var hist = svg.append("g")
                .attr("class", "hist")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            hist.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0" + "," + height + ")")
                .call(d3.axisBottom(x)
                );
            // draw histogram bars
            var bars = hist.selectAll(".bar")
                .data(function(d) { return d.values; })
                .enter()
                .append("g")
                .attr("class", "bar")
                .attr("transform", function(s) {
                    return "translate(" + x(s.x0) + "," + y(s.length) + ")";
                });
            bars.append("rect")
                .attr("class", "bar")
                .attr("x", 1)
                .attr("width", function(s) { return x(s.x1) - x(s.x0) - 1; })
                .attr("height", function(s) { return height - y(s.length); })
                .attr("fill", "#a6cee3");
            bars.append("text")
                .attr("class", "hist label")
                .attr("dy", ".75em")
                .attr("y", -12)
                .attr("font-size", "0.6em")
                .attr("x", function(s) { return (x(s.x1) - x(s.x0))/2; })
                .attr("text-anchor", "middle")
                .text(function(s) {
                    if (s.length > 0) {
                        return s.length;
                    }
                })
                .style("fill", "charcoal");
        });
    });}
    /*length */
    function length (d) {
        d3.json("/static/data/timeSeries.json").then(function(data) {
            data.forEach(function (d) {
                var x = d3.scaleLinear()
                    .range([0, width]);
                x.domain(d3.extent(data, function (d) {
                    return d.lengthOfCalls;
                }));
                // set parameters for histogram
                var histogram = d3.histogram()
                    .value(function (d) {
                        return d.lengthOfCalls;})
                    .domain(x.domain())
                    .thresholds(x.ticks(7));

                var nest = d3.nest()
                    .key(function (d) {
                        return d.label;})
                    .entries(data);

                var malw = nest.map(function (d) {
                    return {
                        key: d.key,
                        values: histogram(d.values)
                    }
                });

                y.domain([0, 1000]);

                var svg = d3.select("#lengthViewPanel").selectAll("svg")
                    .data(malw)
                    .enter()
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.append("text")
                    .attr("class", "label")
                    .attr("x", margin.left)
                    .attr("y", margin.top/2)
                    .attr("font-size", "1.2em")
                    .text(function(d) { return d.key; });

                var hist = svg.append("g")
                    .attr("class", "hist")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                hist.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0" + "," + height + ")")
                    .call(d3.axisBottom(x).ticks(7))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");


                // draw histogram bars
                var bars = hist.selectAll(".bar")
                    .data(function(d) { return d.values; })
                    .enter()
                    .append("g")
                    .attr("class", "bar")
                    .attr("transform", function(s) {
                        return "translate(" + x(s.x0) + "," + y(s.length) + ")";
                    });
                bars.append("rect")
                    .attr("class", "bar")
                    .attr("x", 1)
                    .attr("width", function(s) { return x(s.x1) - x(s.x0); })
                    .attr("height", function(s) { return height - y(s.length); })
                    .attr("fill", "#a6cee3");

                bars.append("text")
                    .attr("class", "hist label")
                    .attr("dy", ".75em")
                    .attr("y", -12)
                    .attr("font-size", "0.6em")
                    .attr("x", function(s) { return (x(s.x1) - x(s.x0))/2; })
                    .attr("text-anchor", "middle")
                    .text(function(s) {
                        if (s.length > 0) {
                            return s.length;
                        }
                    })
                    .style("fill", "charcoal");
            });
        });
    }

    /*unique */
    function unique(d) {
        d3.json("/static/data/timeSeries.json").then(function(data) {
            data.forEach(function (d) {
                var x = d3.scaleLinear()
                    .domain([0, 1])
                    .range([0, width]);
                x.domain(d3.extent(data, function (d) {
                    return d.numUniqueCalls;
                }));
                // set parameters for histogram
                var histogram = d3.histogram()
                    .value(function (d) {
                        return d.numUniqueCalls;})
                    .domain(x.domain())
                    .thresholds(x.ticks(10))
                ;

                var nest = d3.nest()
                    .key(function (d) {
                        return d.label;})
                    .entries(data);

                var malw = nest.map(function (d) {
                    return {
                        key: d.key,
                        values: histogram(d.values)
                    }
                });

                y.domain([0, 300]);

                var svg = d3.select("#uniqueViewPanel").selectAll("svg")
                    .data(malw)
                    .enter()
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

                svg.append("text")
                    .attr("class", "label")
                    .attr("x", margin.left)
                    .attr("y", margin.top/2)
                    .attr("font-size", "1em")
                    .text(function(d) { return d.key; });

                var hist = svg.append("g")
                    .attr("class", "hist")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                hist.append("g")
                    .attr("class", "axis")
                    .attr("transform", "translate(0" + "," + height + ")")
                    .call(d3.axisBottom(x).ticks(10))
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");


                // draw histogram bars
                var bars = hist.selectAll(".bar")
                    .data(function(d) { return d.values; })
                    .enter()
                    .append("g")
                    .attr("class", "bar")
                    .attr("transform", function(s) {
                        return "translate(" + x(s.x0) + "," + y(s.length) + ")";
                    });
                bars.append("rect")
                    .attr("class", "bar")
                    .attr("x", 1)
                    .attr("width", function(s) { return x(s.x1) - x(s.x0) - 1; })
                    .attr("height", function(s) { return height - y(s.length); })
                    .attr("fill", "#a6cee3");

                bars.append("text")
                    .attr("class", "hist label")
                    .attr("dy", ".5em")
                    .attr("y", -12)
                    .attr("font-size", "0.6em")
                    .attr("x", function(s) { return (x(s.x1) - x(s.x0))/2; })
                    .attr("text-anchor", "middle")
                    .text(function(s) {
                        if (s.length > 0) {
                            return s.length;
                        }
                    })
                    .style("fill", "charcoal");
            });
        });
    }


// Encoder to represent
var encoderMap = {}
d3.json("/static/data/encoder.json").then(function(data){
    data.forEach(function (d) {
        encoderMap[d["code"]] = d["object"]
    }
    ); // this is your data
});

// Toggles as to craete or destroy table
// Maybe it would be more efficient to show/hide the table
var encoderTableActive = false;

/*
* Build or destroy table on button click
*
* Authors: Matthew Schofield
* Version: 4.17.2020
*/
function encoderAction()
{
    var encoderButton = document.getElementById("encoderButton");
    // Flip toggle
    encoderTableActive = !encoderTableActive;

    // Build or destroy, and restyle the button
    if(encoderTableActive){
        encoderButton.setAttribute("class", "buttonOn")
        buildEncoderTable();
    }else{
        encoderButton.setAttribute("class", "buttonOff")
        destroyEncoderTable();
    }
}

/*
* Builds the encoder table
*
* Authors: Matthew Schofield
* Version: 4.17.2020
*/
function buildEncoderTable()
{
    // Create reference to div and table w/ id encoderTable
    var body = document.getElementsByTagName('body')[0];
    var encoderTableDiv = document.createElement('div');
    encoderTableDiv.setAttribute("id", "encoderTableDiv");
    var encoderTable = document.createElement('table');
    encoderTable.setAttribute("id", "encoderTable");

    // Create reference rows
    var keyRow = encoderTable.insertRow();
    var valueRow = encoderTable.insertRow();
    // Populate rows using map
    for(var key in encoderMap){
        var keyTD = keyRow.insertCell();
        keyTD.appendChild(document.createTextNode(key));

        var valueTD = valueRow.insertCell();
        valueTD.appendChild(document.createTextNode(encoderMap[key]));
    }

    // Add completed table
    encoderTableDiv.append(encoderTable)
    body.append(encoderTableDiv)
}

/*
* Destroy table
*
* Authors: Matthew Schofield
* Version: 4.17.2020
*/
function destroyEncoderTable()
{
    // Grab table
    var encoderTableDiv = document.getElementById('encoderTableDiv');
    // Tell its parent to remove it
    encoderTableDiv.parentNode.removeChild(encoderTableDiv);
}


