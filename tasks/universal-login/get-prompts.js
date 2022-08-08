const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')
const ULprompts = require('../../lib/ul-prompts')

getPrompts()

async function getPrompts() {
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
    const scopes = [ 'read:prompts' ]
    const api = await management(scopes)
    
    console.log(`\ngetting tenant universal login prompts`)

    ULprompts.read(api).then(prompts => {
      if (prompts) {
        console.log('\nprompts ...')
        console.log(prompts)
      }
    })
  } catch (error) {
    console.log('error while updating new universal login prompts.')
    console.error(error)
  }
}