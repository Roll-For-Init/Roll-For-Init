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
    fs.writeFileSync('sample.pdf', data, { encoding: null })
    const src = fs.createReadStream('sample.pdf');

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename= sample.pdf',
        'Content-Transfer-Encoding': 'Binary'
      });
    console.log(statusCode) // => 200
    src.pipe(res);
}

module.exports = { testMessage }

