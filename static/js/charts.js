function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("static/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
//    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
//    console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var sample1 = resultArray[0];
//   console.log(sample1);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var OTUids = resultArray.map(sample => sample.otu_ids);
//    console.log("ids: " + OTUids);
    var OTUlabels = resultArray.map(sample => sample.otu_labels);
    var SampleValues = resultArray.map(sample => sample.sample_values);
    // 3. Create a variable that holds the washing frequency.
    var metaData = data.metadata.filter(sampleCase => sampleCase.id == sample);

    console.log(metaData);
    var washFreq = Number.parseFloat(metaData[0].wfreq);
    console.log(washFreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks =  sample1.otu_ids.slice(0, 10).reverse().map(int => "OTU " + int.toString());
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample1.sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: sample1.otu_labels.slice(0, 10).reverse(),
      orientation: "h",
      type: "bar"
    };
    var data = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      paper_bgcolor: "#e8e8e8",
      margin: {
        l:75,
        r: 75,
        t: 60,
        b: 60
      }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, barLayout);
  

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sample1.otu_ids,
      y: sample1.sample_values,
      text: sample1.otu_labels,
      mode: "markers",
      marker: {
        color: sample1.otu_ids,
        size: sample1.sample_values
      }
    }
    ];
//    console.log(bubbleData);
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {  
      title: "<b>Bacteria Cultures Per Sample</b>",
      paper_bgcolor: "#ababab",
      xaxis: { title: "OTU IDs" },
//      yaxis: { title: "Sample Values" },
      hovermode: "closest",
      width: 950
      
    };
//    console.log(bubbleLayout);
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
//        title: { text: "<h2>Belly Button Washing Frequency</h2><hr><h3>Scrubs per Week</h3>" },
        type: "indicator",
        mode: "gauge+number",
        title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
        gauge: {
          axis: { range: [null, 10]},
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red"},
            { range: [2, 4], color: "orange"},
            { range: [4, 6], color: "yellow"},
            { range: [6, 8], color: "green"},
            { range: [8, 10], color: "blue"}
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75
          }
        }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: "#c2c2c2",
      margin: {
        l:75,
        r: 75,
        t: 60,
        b: 60
      }
//      width: 400, height: 400, margin: { t: 60, b: 60 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
