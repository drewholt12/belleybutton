function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
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
  d3.json("samples.json").then((data) => {
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
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = samplesArray.filter(sampleObj => sampleObj.id === sample);
        console.log(sampleNumber);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumber[0];
    console.log(firstSample);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleNumber[0].otu_ids;
    console.log(otuIds);
    
    var otuLabels = sampleNumber[0].otu_labels;
    console.log(otuLabels);
    
    var sampleValues = sampleNumber[0].sample_values;
    console.log(sampleValues);
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTen = ((otuIds.sort((a,b) => (b.sampleValues- a.sampleValues))).slice(0, 10));
    console.log(topTen);

    var yticks = topTen.map(d => "OTU " + d);
    console.log(`OTU IDS: ${yticks}`);

    // console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var trace = {
      type: "bar",
      x: sampleValues,
      y: yticks,     
      text: otuLabels,
      orientation :"h"
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title : "Top 10 Bacteria Cultures Found",
      xaxis : {title : "Sample Value"},
      yaxis : {title : "OTU ID"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // create bubble plot
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      type: "bubble",
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker : {
        size : sampleValues,
        color : otuIds
      }
    };
    var bubbleData = [trace2]
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title : "Top 10 Bacteria Cultures",
      xaxis : {title : "OTU IDs"},
      yaxis : {title : "Sample Value"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // create gauge charts
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var getWash = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(getWash);
    // 2. Create a variable that holds the first sample in the metadata array.
    var firstWash = getWash[0];
    console.log(firstWash);
    // 3. Create a variable that holds the washing frequency.
    var washNum = parseFloat(getWash[0].wfreq);
    // var washFreq = parseFloat(washNum);
    console.log(washNum);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain : { x: [0,1], y: [0,1] }, 
        type : "indicator",
        mode : "gauge+number",
        value : washNum,
        title : { text: "Belley Button Washing Frequency", 'font' : {'size': 24} },
        gauge: { 
          axis: { visible:true, range: [0,9] },
          bar: { color: "darkblue"},
          steps: [
            {range: [0, 10], color: "lightblue" },
          ] },
          
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {  
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lightyellow",
      font: { color: "darkblue", family: "Arial" }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}