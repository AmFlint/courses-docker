const fs = require('fs');

// Generate random string
const randomFileName =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const absoluteFileName = `/data/${randomFileName}`

fs.writeFile(absoluteFileName, 'volume TP', (err) => {
  if (err) return console.log(err);
  console.log(`File generated properly at ${absoluteFileName}`);
});
