var predictions_log = "/predictions";

function init(){
    d3.json(predictions_log).then(data => {
        console.log(data);

        ////              Log  Table                   \\\\
        var tbody = d3.selectAll("#table-log").select("tbody");
        
        data.forEach((aDictionary) => {
            var row = tbody.append("tr");
            Object.entries(aDictionary).forEach(([key, value]) => {
              var cell = row.append("td");
              cell.text(value);
            });
        });


    })  
}

init();

// Select the button
function myFunction() {
    const filter = document.querySelector('#myInput').value.toUpperCase();
    const trs = document.querySelectorAll('#table-log tr:not(.header)');
    trs.forEach(tr => tr.style.display = [...tr.children].find(td => td.innerHTML.toUpperCase().includes(filter)) ? '' : 'none');
  }
 
myFunction();




