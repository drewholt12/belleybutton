// retrieve the data from the data file
const url = d3.json("samples.json").then(function(data){
    console.log(data);
    });

// display metadata for any individual - this one is for the 1st person at index 0
d3.json("samples.json").then(function(data){
    firstPerson = data.metadata[0];
    Object.entries(firstPerson).forEach(([key, value]) =>
      {console.log(key + ': ' + value);});
});