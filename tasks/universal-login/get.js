const management = require('./../../lib/get-management-client')
const inquirer = require('inquirer')
const ULbranding = require('./../../lib/ul-branding')
const ULwidget = require('./../../lib/ul-widget')
const ULtemplate = require('./../../lib/ul-template')
const ULprompts = require('./../../lib/ul-prompts')
const fs = require('fs')
const path = require('path')
const themes = require('./themes')
const jsonfile = require('jsonfile')

get()

async function get() {
  // prompt user to select tenant, then instantiate the management API client for that tenant
  const scopes = [
    'read:branding',
    'read:prompts'
  ]
  const api = await management(scopes)
  const theme = await promptSaveTheme()
  
  // fetch the stuff from the tenant in paralell ...
  await ULbranding
    .read(api)
    .then(async branding => {
      if (!branding || Object.keys(branding).length == 0) {
        console.log('branding object was empty.\n')
        return
      }
      
      if (theme.save) {
        const saveResult = await saveJSONFile(theme.directory, ULbranding.filename, branding)
        console.log(`Saved ${ULbranding.filename} to ${theme.name} theme.`)
      } else {
        console.log('branding ...')
        console.log(branding)
      }

      console.log('\n')
    })

  await ULwidget
    .read(api)
    .then(async widget => {
      if (!widget || Object.keys(widget).length == 0) {
        console.log('widget object was empty.\n')
        return
      }
      
      if (theme.save) {
        const saveResult = await saveJSONFile(theme.directory, ULwidget.filename, widget)
        console.log(`Saved ${ULwidget.filename} to ${theme.name} theme.`)
      } else {
        console.log('widget ...')
        console.log(widget)
      }

      console.log('\n')
    })

  await ULtemplate
    .read(api)
    .then(async html => {
      if (!html) {
        console.log('The universal login html template was empty.\n')
        return
      }
      
      console.log('html template ...')
      console.log(html)
      console.log('\n')
    })

  await ULprompts
    .read(api)
    .then(async prompts => {
      if (!prompts || Object.keys(prompts).length == 0) {
        console.log('prompts object was empty.\n')
        return
      }
      
      if (theme.save) {
        const saveResult = await saveJSONFile(theme.directory, ULprompts.filename, prompts)
        console.log(`Saved ${ULprompts.filename} to ${theme.name} theme.`)
      } else {
        console.log('prompts ...')
        console.log(prompts)
      }

      console.log('\n')
    })
}

async function promptSaveTheme () { 
  const save = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'name',
        message: 'Do you want to save the theme?',
        default: true
      }
    ])
  
  console.log(save)
  if (!save.name) {
    return {
      save: false,
      name: null,
      directory: null
    }
  }

  const newTheme = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'name',
        message: 'Select an option?',
        choices: [ 'Save as new theme', 'Overwrite existing theme' ],
        default: 'Save as new theme'
      }
    ])

  const isNewTheme = newTheme.name == 'Save as new theme'

  const choice = await inquirer
    .prompt([
      {
        type: isNewTheme ? 'string' : 'list',
        name: 'name',
        message: isNewTheme ? 'Please name the new theme.' : 'Select the theme to overwrite.',
        default: 'NewTheme',
        choices: isNewTheme ? undefined : themes.map(theme => theme.name)
      }
    ])
  
  const directory = path.join(__dirname, `/themes/${choice.name}`)
  return {
    save: true,
    name: choice.name,
    directory
  }
}

async function saveJSONFile (directory, filename, data) {  
  if (!fs.existsSync(directory)){
    fs.mkdirSync(directory, { recursive: true });
  }
  const filepath = path.join(directory, filename)
  return await jsonfile.writeFile(filepath, data, { spaces: 2 })
}