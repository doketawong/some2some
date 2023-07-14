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
    {id: 'picture', title: 'Picture'},
    {id: 'size', title: 'Size'},
    {id: 'createDate', title: 'Create Date'}
  ]
})

const { Client } = require('pg')
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'some2some',
  password: 'postgres',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

const url = 'https://graph.facebook.com/v17.0/';
const access_token = 'EAADg4X8ZAH5QBADtCmHQb9jrHURmB6iXhkd8ZC59zZCVx8EAAcdemMHLQeJygDtZAlOXY8bX0Ommttr6ZBIoe9LBbJZCxPHUCGKZBZCv6TtgcbqE7ZBoolSKeLJhcwJB1IKLMSbTF4cMCk5v9oJwveAmxUwwBZBlOBoZBIuKiBZAFDszbM6PKUgVqhYq8wRjSXJzKHK921dR8syMmhANJ78JKeZAy';
const picture = '/attachments?access_token=';
var dataArr = [];
csv.parseFile("instagram.csv", {headers: true})
.on('data', row => {
  processContent(row); 

}
)

const findTitle = `SELECT * FROM product_list where content = $1`;


function processContent(row){
  axios.get(url + row.No + picture +access_token)
  .then (function (tempResponse) {
    // handle success\
    var pictureUrl = tempResponse.data.data[0]; 
    const picture = pictureUrl.media.image.src;
    const content = row.Content.replace(/(\r\n|\n|\r)/gm, "").trim();
    const title = getTitle(content);
    const price = getPrice(content);
    const size = getSize(content);
    const createDate = row.CreateDate;
    client.query(findTitle, [title], (err, res)=> {
      console.log(res.rows);
      if(res.rows.length ==0){
      dataArr.push({id:row.No, content:content, title: title,price:price, picture:picture, size: size, createDate: createDate});
      if(dataArr.length>= 22){
        csvWriter.writeRecords(dataArr);
        console.log('end'); 
      }
    }
    });
})
}


function isNumber(char) {
    return /^\d$/.test(char); 
}

function getTitle(content) {
  const titleOpen = content.indexOf('【');
  const titleClose = content.indexOf('】');
  if(titleOpen < 0 || titleClose < 0){
    return '';
  }
  const sortedString = content.substring(titleOpen+1, titleClose);
  return sortedString;
}

function getSize(content) {
  const sizeOpen = content.indexOf('/');
  const sizeDesc = content.substring(sizeOpen+2, content.length);
  const sizeClose = sizeDesc.indexOf('/');
  if(sizeOpen < 0 || sizeClose < 0){
    return '';
  }
  const sortedString = sizeDesc.substring(0, sizeClose);
  return sortedString;
}

function getPrice(content) {
  const priceIndex = content.indexOf('$');
  
  if(priceIndex > 0){
    var price = content.substring(priceIndex + 1, priceIndex+4);
    if(!isNumber(price.substring(price.length-1))){ 
        price = price.substring(0, price.length-1);
    }
    tempPrice = price;
  } else {
    return '';
  }

  return tempPrice;
}

