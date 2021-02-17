var predictions_log = "/predictions";

// data = [{"cat": 0.0, "class_item": "Dog", "dog": 100.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 91.64, "class_item": "Cat", "dog": 8.36}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 0.0, "class_item": "Dog", "dog": 100.0}, {"cat": 100.0, "class_item": "Cat", "dog": 0.0}, {"cat": 98.86, "class_item": "Cat", "dog": 1.14}]

function init(){
    d3.json(predictions_log).then(data => {
        console.log(data);
        
        cats_array =  data.map(x => x.class_item).filter(x => x === 'Cat');
        dogs_array =  data.map(x => x.class_item).filter(x => x === 'Dog');
        all_data = data.length;
        // console.log(all_data); 
        
        catsVSdogsPlot(cats_array, dogs_array, all_data);
    
        ////              Model Accuracy Plots                     \\\\
        cats = data.filter(x => x.class_item === "Cat")
        // console.log(cats);
        cat_accuracy =  cats.map(x => x.cat).filter(x => x > 0);
        // console.log(cat_accuracy);
        // console.log(`this is mean cat accuracy: ${mean(cat_accuracy)}`)

        dogs = data.filter(x => x.class_item === "Dog")
        // console.log(dogs)
        dog_accuracy =  dogs.map(x => x.dog).filter(x => x > 0);
        // console.log(dog_accuracy);
        // console.log(`this is mean dog accuracy: ${mean(dog_accuracy)}`)

        buildGauge(mean(cat_accuracy), "cat_avg_accuracy");
        buildGauge(mean(dog_accuracy), "dog_avg_accuracy");

    })  
}

init();

function catsVSdogsPlot(cats_array, dogs_array, all_data){

    no_cats = cats_array.length;
    cats_ratio = Math.round(no_cats/all_data * 100)
    // console.log([no_cats, cats_ratio]);
    
    no_dogs = dogs_array.length;
    dogs_ratio = Math.round(no_dogs/all_data * 100)

    var xValue = ['Cats', 'Dogs', "Total Entries"];
    var yValue = [cats_ratio, dogs_ratio, 100];
    // console.log(yValue);

    var countsText = [no_cats, no_dogs, all_data];
    // console.log(countsText.map(String));

    var trace1 = {
        x: xValue,
        y: yValue,
        type: 'bar',
        text: countsText.map(String),
        textposition: 'auto',
        hoverinfo: 'none',
        marker: {
            color: 'rgb(158,202,225)',
            opacity: 0.6,
            line: {
                color: 'rgb(8,48,107)',
                width: 1.5
            }   
        }
    };

    var data = [trace1];

    var layout = {
        barmode: 'stack',
        yaxis: {
            title:'Percentage (%)',
        },
        barmode: 'stack',
        plot_bgcolor:"#EAC2b1",
        paper_bgcolor:"#EAC2b1"
    };

    Plotly.newPlot("catsDogsPlot", data, layout); 

};

function mean(arr) {
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i];
    }
    var meanValue = total / arr.length;
  
    return meanValue;
};

function buildGauge(avg_accuracy, div_id) {
    // Enter the model accuracy between 0 and 180
    var level = parseFloat(avg_accuracy) + 80;
  
    // Trig to calc meter point
    var degrees = 180 - level;
    // console.log(`This is degrees: ${degrees}`);
    var radius = 0.5;
    var radians = (degrees * Math.PI) / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
  
    // Path: may have to change to create a better triangle
    var mainPath = "M -.0 -0.05 L .0 0.05 L ";
    var pathX = String(x);
    var space = " ";
    var pathY = String(y);
    var pathEnd = " Z";
    var path = mainPath.concat(pathX, space, pathY, pathEnd);
  
    var data = [
      {
        type: "scatter",
        x: [0],
        y: [0],
        marker: { size: 12, color: "850000" },
        showlegend: false,
        name: "Accuracy",
        text: avg_accuracy,
        hoverinfo: "text+name"
      },
      {
        values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
        rotation: 90,
        text: ["90-100", "80-90", "70-80", "60-70", "50-60", "40-50", "30-40", "20-30", "0-20", ""],
        textinfo: "text",
        textposition: "inside",
        marker: {
          colors: [
            "rgba(0, 105, 11, .5)",
            "rgba(10, 120, 22, .5)",
            "rgba(14, 127, 0, .5)",
            "rgba(110, 154, 22, .5)",
            "rgba(170, 202, 42, .5)",
            "rgba(202, 209, 95, .5)",
            "rgba(210, 206, 145, .5)",
            "rgba(232, 226, 202, .5)",
            "rgba(240, 230, 215, .5)",
            "rgba(255, 255, 255, 0)"
          ]
        },
        labels:  ["90-100", "80-90", "70-80", "60-70", "50-60", "40-50", "30-40", "20-30", "0-20", ""],
        hoverinfo: "label",
        hole: 0.5,
        type: "pie",
        showlegend: false
      }
    ];
  
    var layout = {
      shapes: [
        {
          type: "path",
          path: path,
          fillcolor: "850000",
          line: {
            color: "850000"
          }
        }
      ],
      plot_bgcolor:"#EAC2b1",
      paper_bgcolor:"#EAC2b1",
    //   title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      height: 500,
      width: 500,
      xaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      },
      yaxis: {
        zeroline: false,
        showticklabels: false,
        showgrid: false,
        range: [-1, 1]
      }
    };
  
    // var GAUGE = document.getElementById(div_id);
    Plotly.newPlot(div_id, data, layout);
  }








