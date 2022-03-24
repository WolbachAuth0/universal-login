const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const schemes = require('./schemes')
const management = require('./../../lib/get-management-client')

const scopes = [ 'update:branding' ]
const prompts = [
  {
    type: 'list',
    name: 'theme',
    message: 'Select the Universal Login theme:',
    choices: schemes.map(scheme => scheme.name),
  }
]

setUniversalLogin()

async function setUniversalLogin() {
  try {
    const client = await management(scopes)
    const answers = await inquirer.prompt(prompts)
    // console.log(answers)
    // console.log(schemes)

    const directory = schemes.find(scheme => scheme.name == answers.theme).path
    const filename = path.join(directory, `template.html`)
    const branding = path.join(directory, `branding.json`)
    console.log(`\nsetting new universal login html template from ${filename}\n`)

    // read the HTML template into a string, and create a JSON body from the HTML template
    let template   
    const buffer = fs.readFileSync(filename)
    template = buffer.toString()
    const json = JSON.stringify({ template })
    const params = {}
    const response = await client.setBrandingUniversalLoginTemplate(params, json)
    console.log('successfully set html', response)

    // set the branding (colors and logo)
    const updateBranding = await client.updateBrandingSettings(params, require(branding))
    console.log('success updated branding')
    console.log(updateBranding)
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}


    
