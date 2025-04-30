const fs = require('fs');
const path = require('path');

// Source file path - using production env file with the actual credentials
const sourcePath = path.join(__dirname, '.env-files', 'env.production');

// Destination file path
const destPath = path.join(__dirname, '.env.local');

// Read the source file
fs.readFile(sourcePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the production env file:', err);
    return;
  }

  // Write to the destination file
  fs.writeFile(destPath, data, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to .env.local:', err);
      return;
    }
    console.log('Successfully created .env.local with production variables');
  });
}); 