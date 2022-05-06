const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')

const scopes = [ 'update:branding' ]
const prompts = [
  {
    type: 'list',
    name: 'theme',
    message: 'Select the Universal Login theme:',
    choices: themes.map(scheme => scheme.name),
  }
]

setUniversalLogin()

async function setUniversalLogin() {
  try {
    const api = await management(scopes)
    const answers = await inquirer.prompt(prompts)

    const directory = themes.find(scheme => scheme.name == answers.theme).path
    const filename = path.join(directory, `template.html`)
    const branding = path.join(directory, `branding.json`)
    const prompttext = path.join(directory, `prompts.json`)
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

    // set the prompts
    // See ... https://auth0.github.io/node-auth0/ManagementClient.html#updateCustomTextByLanguage
    // and ... https://auth0.com/docs/customize/universal-login-pages/customize-login-text-prompts
    const promptParams = {
      prompt: 'login',
      language: 'en',
      body: require(prompttext)
    }
    const setPrompts = await api.prompts.updateCustomTextByLanguage(promptParams)
    console.log('success set login prompts')
    console.log(setPrompts)
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}


    
