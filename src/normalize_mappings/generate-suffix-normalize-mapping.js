const fs = require('fs');

console.warn('\x1b[34m', '👷 Building suffix normalize mapping from suffix-mapping.txt');
fs.readFile('src/normalize_mappings/suffix-mapping.txt', (err, data) => {
  if (err) throw err;

  const suffixs = [];
  data.toString().split('\n').map((line) => {
    const items = line.split(',');
    const cleanStringsArray = [];
    items.forEach((item) => {
      cleanStringsArray.push(item.trim());
    });
    suffixs.push(cleanStringsArray);
    return suffixs;
  });

  let flatObject = {};
  suffixs.forEach((line) => {
    line.forEach((item) => {
      flatObject = { [item]: line[0], ...flatObject };
    });
  });

  const suffixMappingJson = JSON.stringify(flatObject, null, 2);
  const suffixMappingJs = `export default ${suffixMappingJson};`;

  fs.writeFile('src/normalize_mappings/suffix-normalize-mapping.js', suffixMappingJs, 'utf-8', (error) => {
    if (error) throw error;
    console.warn('\x1b[32m', '✨ Sucessfully built suffix-normalize-mapping.js');
  });
});
