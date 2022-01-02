const fs = require('fs');

let dir = fs.readdirSync('./public/cats');
console.log(dir)

dir = dir.filter(fileName => { 
  return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')
})

dir = dir.sort(function(elem, elem2) {
  let stats = fs.statSync('./public/cats/' + elem);
  let stats2 = fs.statSync('./public/cats/' + elem2);

  console.log(stats.birthtimeMs - stats2.birthtimeMs)

  return stats2.birthtimeMs - stats.birthtimeMs;
})

fs.writeFileSync('./public/cats/fileList.json', JSON.stringify(dir));