const fs = require('fs')
const path = require('path')
const filename = `widget.json`

module.exports = {
  read,
  update,
  filename
}

function getJSON(directory) {
  const filepath = path.join(directory, filename)
  return fs.existsSync(filepath) ? require(filepath) : null
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
    return {}
  }
}

// set the branding (colors and logo)  
async function update (api, directory) {
  try {
    let json = getJSON(directory)
    const theme = themeName(directory)
    const current = await read(api)
    const themeId = current.themeId
    console.log(`Current themeId = ${themeId}`)

    if (json) {  
      console.log(`found widget.json file for the ${theme} theme. Setting tenant to ${theme} widget theme ...`)
      delete json.themeId
      if (current.themeId) {
        // update theme by id
        const params = { id: themeId }
        const response = await api.branding.updateTheme(params, json)
        console.log(`successfully updated login widget theme (themeId: ${themeId})`)
        console.log(response)
      } else {
        // create a new theme
        const response = await api.branding.createTheme(json)
        console.log(`successfully created login widget theme`)
        console.log(response)
      }
    } else {
      console.log(`A widget.json file was not found for the ${theme} theme. Setting tenant to default widget theme ...`)
      if (themeId) {
        const response = await api.branding.deleteTheme({ id: themeId })
        console.log(response)
      }
    }
  } catch (error) {
    console.log('error while updating new universal login branding.')
    throw error
  }
}
