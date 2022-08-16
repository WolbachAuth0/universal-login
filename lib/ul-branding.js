const fs = require('fs')
const path = require('path')

module.exports = {
  read,
  update
}

function getJSON(directory) {
  const filename = path.join(directory, `branding.json`)
  return fs.existsSync(filename) ? require(filename) : null
}

function themeName(directory) {
  const tokens = directory.split('/')
  return tokens[tokens.length - 1]
}

async function read(api) {
  try {
    console.log(`fetching new universal login branding from ${api.tenantName} ...`)
    const response = await api.getBrandingSettings()
    return response
  } catch (err) {
    console.log(`\nerror while getting new universal login branding from ${api.tenantName}.`)
    console.error(err)
  }
}

// set the branding (colors and logo)  
async function update (api, directory) {
  try {
    const json = getJSON(directory)
    const theme = themeName(directory)
    const params = {}
    if (json) {
      const response = await api.updateBrandingSettings(params, json)
      console.log('successfully updated branding')
      console.log(response)
    } else {
      console.log(`branding.json file was not found for the ${theme} theme.`)
    }
  } catch (error) {
    console.log('error while updating new universal login branding.')
    throw error
  }
}
