const fs = require('fs')
const path = require('path')
const scopes = [
  'update:branding',
]
const management = require('./../get-management-client')(scopes)
const Select = require('../../lib/Select')
const schemes = require('./schemes')

const schemeSelect = new Select({
  question: 'Select the universal login theme from the available templates:',
  options: schemes.map(scheme => scheme.name),
  answers: schemes.map(scheme => scheme.path),
  pointer: '>',
  color: 'blue',
  callback: set
})
schemeSelect.start()

// Management API SDK documentation
// https://auth0.github.io/node-auth0/

async function set(scheme) {
  const filename = path.join(scheme, `template.html`)
  const branding = path.join(scheme, `branding.json`)

  console.log(`\nsetting new universal login html template from ${filename}\n`)
  try {
    let template   
    const buffer = fs.readFileSync(filename)
    template = buffer.toString()
    
    const json = JSON.stringify({ template })
    const params = {}
    const response = await management.setBrandingUniversalLoginTemplate(params, json)
    console.log('successfully set html', response)

    const updateBranding = await management.updateBrandingSettings(params, require(branding))
    console.log('success updated branding')
    console.log(updateBranding)
  } catch (err) {
    console.log('error while updating new universal login.')
    console.error(err)
  }
}
