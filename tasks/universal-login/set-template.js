const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')
const ULtemplate = require('../../lib/ul-template')


setUniversalLogin()

async function setUniversalLogin() {
  // set up the console prompts
  const prompts = [
    {
      type: 'list',
      name: 'theme',
      message: 'Select the Universal Login theme:',
      choices: themes.map(scheme => scheme.name),
    }
  ]
  try {
    // prompt user to select tenant, then instantiate the management API client for that tenant
    const scopes = [
      'update:branding',
      'update:prompts'
    ]
    const api = await management(scopes)
    // display the theme prompts to the console
    const answers = await inquirer.prompt(prompts)
    // from the selected answers, get the theme directory
    const directory = themes.find(scheme => scheme.name == answers.theme).path
    
    // perform the updates
    console.log(`\nUpdating new universal login for ${api.tenantName} tenant from ${answers.theme} theme.`)
    await ULtemplate.update(api, directory)
    
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}
