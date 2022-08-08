const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')
const ULprompts = require('../../lib/ul-prompts')

setPrompts()

async function setPrompts() {
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
    const scopes = [ 'update:prompts' ]
    const api = await management(scopes)
    // display the theme prompts to the console
    const answers = await inquirer.prompt(prompts)
    // from the selected answers, get the theme directory
    const directory = themes.find(scheme => scheme.name == answers.theme).path
    console.log(`\nsetting tenant universal login prompts`)

    await ULprompts.update(api, directory)
  } catch (error) {
    console.log('error while updating new universal login prompts.')
    console.error(error)
  }
}