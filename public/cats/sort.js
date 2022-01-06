const fs = require('fs');
const sharp = require('sharp')



let dir = fs.readdirSync('./public/cats');
console.log(dir)

dir = dir.filter(fileName => { 
  return fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png')
})

dir.forEach(file => {
  sharp('./public/cats/' + file).resize({ width: 333 }).toBuffer().then(data => {
    fs.writeFileSync('./public/cats/small/' + file.replace(' ', '%20'), data)
  })
})

dir = dir.sort(function(elem, elem2) {
  let stats = fs.statSync('./public/cats/' + elem);
  let stats2 = fs.statSync('./public/cats/' + elem2);

  console.log(stats.birthtimeMs - stats2.birthtimeMs)

  return stats2.birthtimeMs - stats.birthtimeMs;
})

dir = dir.map(elem => elem.replace(' ', '%20'));

fs.writeFileSync('./public/cats/fileList.json', JSON.stringify(dir));