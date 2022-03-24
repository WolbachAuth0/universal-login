const fs = require('fs')
const path = require('path')
const management = require('./../../lib/get-management-client')
const themes = require('./themes')

reset()

async function reset() {
  const scopes = [ 'update:branding', 'delete:branding' ]
  try {
    const api = await management(scopes)

    const directory = themes.find(scheme => scheme.name == 'default').path
    const filename = path.join(directory, `template.html`)
    const branding = path.join(directory, `branding.json`)
    console.log(`\nsetting new universal login html template from ${filename}\n`)

    // read the HTML template into a string, and create a JSON body from the HTML template
    let template   
    const buffer = fs.readFileSync(filename)
    template = buffer.toString()
    const json = JSON.stringify({ template })
    const params = {}
    const response = await api.setBrandingUniversalLoginTemplate(params, json)
    console.log('successfully set html', response)

    // set the branding (colors and logo)
    const updateBranding = await api.updateBrandingSettings(params, require(branding))
    console.log('success updated branding')
    console.log(updateBranding)
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}