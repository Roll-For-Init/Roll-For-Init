const router = require('express').Router();
const pdf_controller = require('../controllers/pdf.controller');

router.post('/pdfGen', pdf_controller.testMessage);

module.exports = router;
