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

setPrompts()

async function setPrompts() {
  try {
    const api = await management(scopes)
    const answers = await inquirer.prompt(prompts)

    const directory = themes.find(scheme => scheme.name == answers.theme).path
    const prompttext = path.join(directory, `prompts.json`)
    const data = require(prompttext)
    const keys = Object.keys(data)
    console.log(`\nsetting tenant prompts from ${prompttext}\n`)

    for (let prompt of keys) {
      // set the prompts
      // See ... https://auth0.github.io/node-auth0/ManagementClient.html#updateCustomTextByLanguage
      // and ... https://auth0.com/docs/customize/universal-login-pages/customize-login-text-prompts
      let body = {}
      body[prompt] = data[prompt]
      const promptParams = {
        prompt,
        language: 'en',
        body
      }
      const setPrompts = await api.prompts.updateCustomTextByLanguage(promptParams)
      console.log('success set login prompts')
      console.log(setPrompts)
    }
    
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}