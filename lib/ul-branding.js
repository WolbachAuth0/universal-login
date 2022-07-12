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
    const response = await api.getBrandingSettings()
    return response
  } catch (err) {
    console.log(`error while getting new universal login branding from ${api.tenantName}.`)
    console.error(err)
  }
}

// set the branding (colors and logo)  
async function update (api, directory) {
  try {
    const branding = getJSON(directory)
    const theme = themeName(directory)
    const params = {}
    if (branding) {
      const response = await api.updateBrandingSettings(params, branding)
      console.log('\nsuccess updated branding')
      console.log(response)
    } else {
      console.log(`\nbranding.json file was not found for the ${theme} theme.`)
    }
  } catch (error) {
    console.log('error while updating new universal login branding.')
    throw error
  }
}