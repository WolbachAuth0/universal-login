const fs = require('fs')
const path = require('path')
const scopes = [
  'update:branding',
]
const management = require('./../get-management-client')(scopes)
const filename = path.join(__dirname, 'universal-login.html')
set(filename)

async function set(filename) {
  console.log('setting new universal login html template ...')
  try {
    let template
    if (filename) {
      const buffer = fs.readFileSync(filename)
      template = buffer.toString()
    } else {
      template = `<!DOCTYPE html>
      <html>
        <head>
          {%- auth0:head -%}
        </head>
        <body class="_widget-auto-layout">
          {%- auth0:widget -%}
        </body>
      </html>
      `
    }
    const json = JSON.stringify({ template })
    const params = {}
    const response = await management.setBrandingUniversalLoginTemplate(params, json)
    console.log('success', response)
  } catch (err) {
    console.log('error while updating new universal login.')
    console.error(err)
  }
}
