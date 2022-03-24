const path = require('path')
const fs = require('fs')

const files = fs.readdirSync(__dirname)
const directories = files
  .map(file => {
    return { name: file, path: path.join(__dirname, file) }
  })
  .filter(item => fs.statSync(item.path).isDirectory())

module.exports = directories
