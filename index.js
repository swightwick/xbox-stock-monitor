const axios = require('axios');
require('dotenv').config()

let myWebhook = process.env.WEBHOOK_URL
let pid = 10203371
let avatar = 'https://www.chargedretail.co.uk/wp-content/uploads/2021/10/Currys-New-Pic_ST.jpg'
let availableConsoles

const getStock = () => {
  try {
    return axios.get('https://api.currys.co.uk/smartphone/api/productsStock/' + pid , {})
  } catch (error) {
    console.error(error)
  }
}

const countStock = async () => {
  const stock = getStock()
    .then(response => {
      availableConsoles = response.data.payload[0].quantityAvailable
      availablePhysical = response.data.payload[0].quantityPhysical

      if (response.data.payload[0].quantityPhysical > 0) {
        console.log(`Xbox Physical available`)
      }
      if (response.data.payload[0].quantityAvailable == 0) {
        console.log(`Xbox OOS`)
      }
      if (response.data.payload[0].quantityAvailable > 0) {
        postHook(availableConsoles)
        console.log(`${response.data.payload[0].quantityAvailable} In Stock!`)
      }
    })
    .catch(error => {
      console.log(error)
  })
}

const postHook = (availableConsoles) => {
  axios
  .post(myWebhook, {
    username: 'Xbox Stock',
    avatar_url: avatar,
    content: `${availableConsoles} Xbox Series X in Stock at Currys!`
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
  })
  .catch(error => {
    console.error(error)
  })
}

// setInterval(function() { 
//   countStock()
//   console.log("20mins completed");
// }, 5000);

countStock()

