const fs = require('fs')
const path = require('path')

module.exports = {
  read,
  update
}

function getJSON(directory) {
  const filename = path.join(directory, `widget.json`)
  return fs.existsSync(filename) ? require(filename) : null
}

function themeName(directory) {
  const tokens = directory.split('/')
  return tokens[tokens.length - 1]
}

async function read (api) {
  try {
    const widget = await api.branding.getTheme({ id: 'default' })
    return widget
  } catch (error) {
    console.log(`error while fetching new universal login widget theme from the ${api.tenantName} tenant`)
    console.error(error)
  }
}

// set the branding (colors and logo)  
async function update (api, directory) {
  try {
    let json = getJSON(directory)
    const theme = themeName(directory)
    if (json) {
      const params = { id: json.themeId }
      delete json.themeId
      const response = await api.branding.updateTheme(params, json)
      console.log(`\nsuccessfully updated login widget`)
      console.log(response)
    } else {
      console.log(`\na widget.json file was not found for the ${theme} theme.`)
    }
  } catch (error) {
    console.log('error while updating new universal login branding.')
    throw error
  }
}
