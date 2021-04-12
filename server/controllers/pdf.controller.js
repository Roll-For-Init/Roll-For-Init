const fs = require('fs')
const Anvil = require('@anvilco/anvil')


const pdfTemplateID = '5jfMxXvdy67BJPIMNg0o'
const apiKey = 'SxReYSrsBCxyO11FSPnR2ZDnNKmo0lNV'

// JSON data to fill the PDF

  const pdfFill = async (req, res) => {
    const anvilClient = new Anvil({ apiKey })
    const { statusCode, data } = await anvilClient.fillPDF(pdfTemplateID, req.body)
    fs.writeFileSync('characterSheet.pdf', data, { encoding: null })
    const src = fs.createReadStream('characterSheet.pdf');
    console.log(statusCode) // => should be 200
    src.pipe(res);
}


module.exports = { pdfFill }

