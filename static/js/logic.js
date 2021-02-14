var predictions_log = "/predictions";

d3.json(predictions_log).then(data => {
    console.log(data);
})

// d3.json(predictions_log, data => {
//     console.log(data);
// })

// fetch(predictions_log)
// .then(res => res.json())
// .then(data => {
//     console.log(data);
// })
// .catch(rejected => {
//     console.log(rejected);
// });