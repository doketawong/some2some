var csv = require('fast-csv');
const axios = require('axios'); 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'consolidate.csv',
  header: [
    {id: 'id', title: 'No'},
    {id: 'content', title: 'Content'},
    {id: 'title', title: 'Title'},
    {id: 'price', title: 'Price'},
    {id: 'picture', title: 'Picture'}
  ]
})

const url = 'https://graph.facebook.com/v17.0/';
const access_token = 'EAADg4X8ZAH5QBAGfYMHnd4qJDRzKsxatJ7ZBrzQtJjbFMlpPZCfJmL7hbZAhW42KoSg2aZBQ1cdGfmIR02wNnaCPL4UqwLZCLWsf7IaQ7ZCcPDRDGfUmDpR0BFW1VGTt9htZCzWrIZBc25xKetKJuncG1HrkYpZBNesmpsHRDdeFCAZBDeuuOZBQTgpmKFuFwigNghBBzjFbwanbnx8IOxnUhGEb';
const picture = '/attachments?access_token=';
var dataArr = [];
csv.parseFile("instagram.csv", {headers: true})
.on('data', row => {

    var tempPicture;
    var tempPrice;
    axios.get(url + row.No + picture +access_token)
    .then (function (tempResponse) {
      // handle success
      var pictureUrl = tempResponse.data.data[0];
      tempPicture = pictureUrl.media.image.src;

      const priceIndex = row.Content.indexOf('$');

      const title = getTitle(row.Content, priceIndex);

      if(priceIndex > 0){
          var price = row.Content.substring(priceIndex, priceIndex+4);
          if(!isNumber(price.substring(price.length-1))){
              price = price.substring(0, price.length-1);
          }
          tempPrice = price;
      }
      dataArr.push({id:row.No, content:row.Content, price:tempPrice, picture:tempPicture});
  
      
    })

}
).on('end', end => 
csvWriter.writeRecords(dataArr));


function isNumber(char) {
    return /^\d$/.test(char);
  }

  function getTitle(content, priceIndex) {
    const sortedString = content.substring(0,priceIndex)
    const hyphenIndex = content.indexOf('-');
    if(hyphenIndex > 0){
    }

    return /^\d$/.test(char);
  }