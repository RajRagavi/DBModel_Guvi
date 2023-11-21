
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'text-files', 'index.html'));
  });

app.post('/createFile', (req, res) => {
    const folderPath = 'text-files'; // specify the folder
    const fileName = `${new Date().toISOString().replace(/:/g, '-')}.txt`; // current date-time format
    const filePath = path.join(folderPath, fileName);
  
    const content = new Date().toString();
  
    // Check if the folder exists, if not, create it
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  
    fs.writeFile(filePath, content + '\n', { flag: 'a' }, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).send('Error creating to file');
      }
      console.log('File created successfully at:', filePath);
      res.status(201).send('File created successfully');
    });
  });
  app.get('/getTextFiles', (req, res) => {
    const folderPath = 'text-files'; // specify the folder
  
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading files');
      }
      res.json({ files });
    });
  });
  