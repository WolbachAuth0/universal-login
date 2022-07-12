const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')
const ULtemplate = require('../../lib/ul-template')
const ULbranding = require('../../lib/ul-branding')
const ULprompts = require('../../lib/ul-prompts')

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
    // instantiate the management API client
    const api = await management([ 'update:branding' ])
    // display the theme prompts to the console
    const answers = await inquirer.prompt(prompts)
    // from the selected answers, get the theme directory
    const directory = themes.find(scheme => scheme.name == answers.theme).path
    
    // perform the updates
    console.log(`\nUpdating new universal login for ${api.tenantName} tenant from ${answers.theme} theme.`)
    await ULtemplate.update(api, directory)
    await ULbranding.update(api, directory)
    await ULprompts.update(api, directory)
    
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}
