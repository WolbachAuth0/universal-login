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
    console.log(`\nfetching new universal login widget from ${api.tenantName}\n`)
    const widget = await api.branding.getDefaultTheme()
    return widget
  } catch (error) {
    if (error?.statusCode == 404) {
      console.log(`The ${api.tenantName} tenant currently has no widget branding set for the new universal login.`)
    } else {
      console.log(`error while fetching new universal login widget theme from the ${api.tenantName} tenant`)
      console.error(error)
    }
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
