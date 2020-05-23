const express = require("express");
const app = express();
const ObjectsToCsv = require('objects-to-csv')
const cron = require("node-cron")

const scrapVijesti = require("./scraper");

let idArr = [];



async function get() {
  let result = await scrapVijesti(idArr);
  arr = [["Naslov", "Vrsta", "Područje", "Lokacija", "Broj Spavaćih Soba", 
  "Broj Kupatila", "Cijena", "Stambena Površina", "Zemljište", 
  "Parking Mjesta", "Od Mora", "Novogradnja", "Klima", "Opis", "Oglasio", 
  "Mobilni", "Id Oglasa", "Slike​", "URL"
  ]].concat(result)


  result.map((x) => {
    idArr.push(x[16])
    return x[16]
  })

  console.log(idArr)

  function makeTableHTML(myArray) {
    var result = "<table border=1 style='border-collapse: collapse;'>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr style='text-align: center;'>";
        for(var j=0; j<myArray[i].length; j++){
            result += "<td>"+myArray[i][j]+"</td>";
        }
        result += "</tr>";
    }
    result += "</table>";

    return result;
}
app.use('/datacsv', function(req, res) {
  res.sendFile(__dirname+"/data.csv")
})

app.get('/', function(req, res) {
  res.send('<a download="data.csv" href="/datacsv'+
  '">Download</a><br>'+makeTableHTML(arr));
})

  if (result){
  const csv = new ObjectsToCsv(result)
  await csv.toDisk('./data.csv', { append: true })
  }
}
get();
let task = cron.schedule('0 12 * * *', () => {
  get();
}, {
  scheduled: true,
});

task.start();


app.listen(3000, (err, data) => {
  if (!err) console.log("Connected")
})

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});