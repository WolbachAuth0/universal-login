const fs = require('fs')
const path = require('path')
const filename = 'template.html'

module.exports = {
  read,
  update,
  filename
}

function getJSON (directory) {
  const filepath = path.join(directory, filename)
  if (fs.existsSync(filepath)) {
    // read the HTML template into a string, and create a JSON body from the HTML template
    let template   
    const buffer = fs.readFileSync(filepath)
    template = buffer.toString()
    const json = JSON.stringify({ template })
    return json
  } else {
    return null
  }
}

function themeName (directory) {
  const tokens = directory.split('/')
  return tokens[tokens.length - 1]
}

async function read (api) {
  try {
    console.log(`fetching new universal login html template from ${api.tenantName} ...`)
    const template = await api.getBrandingUniversalLoginTemplate()
    return template.body
  } catch (error) {
    if (error?.statusCode == 404) {
      console.log(`The ${api.tenantName} tenant currently has no html template set for the new universal login.`)
    } else if (error?.statusCode == 400) {
      console.log(`The ${api.tenantName} tenant currently has no custom domain and therefore doesn't have a template set.`)
    } else {
      console.log(`error while getting new universal login template from the ${api.tenantName} tenant`)
      console.error(error)
    }
    return null
  }
}

async function update (api, directory) {
  try {
    const theme = themeName(directory)
    const json = getJSON(directory)
    const params = {}
    if (json) {
      const response = await api.setBrandingUniversalLoginTemplate(params, json)
      console.log('\nsuccessfully set html template')
      console.log(JSON.parse(json).template)
    } else {
      console.log(`\na template.html file was not found for the ${theme} theme.`)
    }
  } catch (error) {
    console.log('error while updating new universal login HTML template.')
    throw error
  }
}
