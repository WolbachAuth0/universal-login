const management = require('./../../lib/get-management-client')
const inquirer = require('inquirer')
const ULbranding = require('./../../lib/ul-branding')
const ULwidget = require('./../../lib/ul-widget')
const ULtemplate = require('./../../lib/ul-template')
const ULprompts = require('./../../lib/ul-prompts')
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
  const theme = await saveTheme()
  
  // fetch the stuff from the tenant in paralell ...
  ULbranding
    .read(api)
    .then(async branding => {
      if (!branding) { return }
      
      if (theme.save) {
        const filepath = path.join(theme.directory, ULbranding.filename)
        const saveResult = await jsonfile.writeFile(filepath, branding)
      } else {
        console.log('\nbranding ...')
        console.log(branding)
      }
    })

  ULwidget
    .read(api)
    .then(async widget => {
      if (!widget) { return }
      
      if (theme.save) {
        const filepath = path.join(theme.directory, ULwidget.filename)
        const saveResult = await jsonfile.writeFile(filepath, widget)
      } else {
        console.log('\nwidget ...')
        console.log(widget)
      }
    })

  ULtemplate
    .read(api)
    .then(async html => {
      if (!html) { return }
      
      if (theme.save) {
        const filepath = path.join(theme.directory, ULtemplate.filename)
        const saveResult = await jsonfile.writeFile(filepath, html)
      } else {
        console.log('\nhtml template ...')
        console.log(html)
      }
    })

  ULprompts
    .read(api)
    .then(async prompts => {
      if (!prompts) { return }
      
      if (theme.save) {
        const filepath = path.join(theme.directory, ULprompts.filename)
        const saveResult = await jsonfile.writeFile(filepath, prompts)
      } else {
        console.log('\nprompts ...')
        console.log(prompts)
      }
    })
}

async function saveTheme () { 
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
    directory
  }
}