const router = require('express').Router();
const pdf_controller = require('../controllers/pdf.controller');

router.post('/pdfGen', pdf_controller.pdfFill);

module.exports = router;
