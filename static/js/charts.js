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


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Build the Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    
    console.log("metadata")
    console.log(resultArray)
    
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
    var temp_sample = data.samples;
    console.log("In buildcharts")
    console.log(temp_sample)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var temp_obj = temp_sample.filter(sampleObj => sampleObj.id == sample)
    console.log(temp_obj)
    //  5. Create a variable that holds the first sample in the array.
    var temp_obj_one = temp_obj[0]
    console.log(temp_obj_one)
   

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    temp_otu_ids = temp_obj_one.otu_ids
    temp_otu_labels = temp_obj_one.otu_labels
    temp_sample_values = temp_obj_one.sample_values

    console.log(temp_otu_ids)
    console.log(temp_otu_labels)
    console.log(temp_sample_values)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    // temp_otuid_sort = temp_otu_ids.sort((a,b) => b - a)
    otuid = temp_otu_ids.slice(0,10).map(temp_otu_ids => `OTU ${temp_otu_ids}`).reverse()

    otulabels = temp_otu_labels.slice(0,10).reverse()
    
    otuvalues = temp_sample_values.slice(0,10).reverse()
    
    var barData = [{
      x: otuvalues,
      y: otuid,
      text: otulabels,
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(158,202,225)',
        opacity: 0.8}
    }];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      titlefont: {"size": 25},
      xaxis: {title: "Sample Value"}
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout)

//*********************************************************** */
    // 1. Create the trace for the bubble chart.
 
    var bubbleData = [{
      x: temp_otu_ids,
      y: temp_sample_values,
      text: temp_otu_labels,
      mode: 'markers',
      marker: {
        size: temp_sample_values,
        color: temp_otu_ids,
        colorscale: 'Jet'
      }
    }];

    // 2. Create the layout for the bubble chart.

    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: "OTU ID"},
      hovermode:'closest',
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 

// ***************************************************
     // 4. Create the trace for the gauge chart.
     var metadata = data.metadata;
     // Filter the data for the object with the desired sample number
     var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

     var result = parseFloat(resultArray[0].wfreq);

    //  If the wfreq is blank or null in the array, then wfreq is 0 on the screen.
     if (!resultArray[0].wfreq){
       console.log("in the if condition")
      result = 0
     }
     
     console.log("frequency is:")
     console.log(result)
    var gaugeData = [
      {
        // domain: { x: [0, 10], y: [0, 10] },
        value: result,
        title: { text: "Scrubs Per Week", font: {size:25}},
        type: "indicator",
        mode: "gauge+number",
        tickmode: 'linear',
        /* Set the placement of the first tick*/
        tick0: 0,
        /* Set the step in-between ticks*/
        dtick: 2,
              
        gauge: {
          axis: { range: [null, 10] },
          bar: { color: "black" },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen" }
          ]
        }
      } 
    ];
    
    // // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: 'Belly Button Washing Frequency',
      titlefont: {"size": 25},
      height: 600,
      width: 500
     
    };

    // // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);

    
  });
}

// Initialize the dashboard
init();


