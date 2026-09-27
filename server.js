const { configDotenv } = require('dotenv');
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
configDotenv();

const app = express();

const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.status(200).send('<h3>Welcome to the PDF RAG Backend Server</h3>');
})


app.post('/upload', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: 'No file to upload'
        })
    }
    // console.log('file: ', req.file);

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    // console.log('PDF Data: ', pdfData);
    const text = pdfData.text;
    // console.log('Extracted Text: ', text);

    res.status(200).json({ message: 'File uploaded successfully', text });
})


app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`)
})