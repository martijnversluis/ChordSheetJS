import fs from 'fs';

const fileAPath = process.argv[2];
const fileBPath = process.argv[3];
const combinedFilePath = process.argv[4];

const fileAContents = fs.readFileSync(fileAPath);
const fileBContents = fs.readFileSync(fileBPath);
const combinedContents = [fileAContents, fileBContents].join('\n\n');

fs.writeFileSync(combinedFilePath, combinedContents);
