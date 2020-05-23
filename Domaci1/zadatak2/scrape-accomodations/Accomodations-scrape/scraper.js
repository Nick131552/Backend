const cheerio = require("cheerio");
const axios = require("axios").default;

const fethHtml = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`, err
    );
  }
};

const scrapVijesti = async (idArr) => {
  let searchResults = []
  let searchFrom;
  let numberOfPages = 1;

  for (let i = 0; i < numberOfPages; i++){
    console.log(i);
    let steamUrl =
    "https://www.realitica.com/?cur_page="+i+"&for=Najam&pZpa=Crna+Gora&pState=Crna+Gora&type%5B%5D=&lng=hr";

  let html = await fethHtml(steamUrl);

  let $ = cheerio.load(html);

  if (i === 0){
    let tempArr = $("body").find("strong").toArray().map((x) => {return $(x).text()})
    numberOfPages = Math.ceil(Number(tempArr[1])/20)
    console.log(numberOfPages)
  }

  searchFrom = ($("body").find(".thumb_div > a").toArray().map((x) => { return $(x).attr("href")}));
  searchFrom = searchFrom.filter((x) => {
    if (idArr.every(y => x.indexOf(y) == -1)){
    return x;
    }
  })


  setTimeout(async function(){
    for (let m = 0; m < searchFrom.length; m++){
      let url = searchFrom[m];
  
      let HTML = await fethHtml(url);
      let $ = cheerio.load(HTML);
  
      let elem = $("body").find("#listing_body");
      elem.find("br").replaceWith("\n")
  
  
      elem = elem.text().replace(/\t/g, "").replace( /(\n)+/g, '\n' ).split("\n")
  
      elem.shift();
      elem.pop();
  
      let newArr = ["\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "\\", "Ne", "Ne", "\\", "\\", "\\", "\\", "\\"]
      newArr[16] = url.replace("https://www.realitica.com/hr/listing/", "")
      let elem2 = $("body").find("#rea_blueimp > a").toArray().map((x) => {return " "+$(x).attr("href")})
      newArr[17] = elem2;
      newArr[18] = url;
  
      for (let n = 0; n < elem.length; n++){
        let x = elem[n]
        if (elem.indexOf(x) === 0){
          newArr[0] = x;
        }
        else if (x.indexOf("Vrsta")>-1){
          newArr[1] = x.replace("Vrsta: ", "");
        }
        else if (x.indexOf("Područje")>-1){
          newArr[2] = x.replace("Područje: ", "");
        }
        else if (x.indexOf("Lokacija")>-1){
          newArr[3] = x.replace("Lokacija: ", "");
        }
        else if (x.indexOf("Spavaćih Soba")>-1){
          newArr[4] = Number(x.replace("Spavaćih Soba: ", ""));
        }
        else if (x.indexOf("Kupatila")>-1){
          newArr[5] = Number(x.replace("Kupatila: ", ""));
        }
        else if (x.indexOf("Cijena")>-1){
          newArr[6] = x.replace("Cijena: €", "");
        }
        else if (x.indexOf("Stambena Površina")>-1){
          newArr[7] = x.replace("Stambena Površina: ", "");
        }
        else if (x.indexOf("Zemljište")>-1){
          newArr[8] = x.replace("Zemljište: ", "");
        }
        else if (x.indexOf("Parking Mjesta")>-1){
          newArr[9] = x.replace("Parking Mjesta: ", "");
        }
        else if (x.indexOf("Od Mora(m)")>-1){
          newArr[10] = x.replace("Od Mora(m): ", "")+"m";
        }
        else if (x.indexOf("Novogradnja")>-1){
          newArr[11] = "Da"
        }
        else if (x.indexOf("Klima Uređaj")>-1){
          newArr[12] = "Da";
        }
        else if (x.indexOf("Opis")>-1){
          newArr[13] = x.replace("Opis: ", "");
        }
        else if (x.indexOf("Oglasio")>-1){
          newArr[14] = x.replace("Oglasio: ", "");
        }
        else if (x.indexOf("Mobitel")>-1){
          newArr[15] = x.replace("Mobitel: ", "");
        }
      }
  
      searchResults.push(newArr)
  
    }
  }, 0)
  }
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(10000);

  return searchResults

};


module.exports = scrapVijesti;
