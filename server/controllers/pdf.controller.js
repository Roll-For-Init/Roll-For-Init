const fs = require('fs')
const Anvil = require('@anvilco/anvil')

const pdfTemplateID = '5jfMxXvdy67BJPIMNg0o'
const apiKey = 'SxReYSrsBCxyO11FSPnR2ZDnNKmo0lNV'

// JSON data to fill the PDF
const exampleData = {
  "title": "My PDF Title",
  "fontSize": 10,
  "textColor": "#CC0000",
  "data": {
    "someFieldId": "Hello World!"
  }
}
const testMessage = async (req, res) => {
    const anvilClient = new Anvil({ apiKey })
    const { statusCode, data } = await anvilClient.fillPDF(pdfTemplateID, exampleData)
    console.log(statusCode) // => 200
    return res.status(200).write(data)
}

module.exports = { testMessage }

