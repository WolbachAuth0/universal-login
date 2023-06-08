const inquirer = require('inquirer')
const themes = require('./themes')
const management = require('./../../lib/get-management-client')
const ULtemplate = require('../../lib/ul-template')
const ULbranding = require('../../lib/ul-branding')
const ULprompts = require('../../lib/ul-prompts')
const ULwidget = require('../../lib/ul-widget')
const fs = require('fs')
const path = require('path')
const jsonfile = require('jsonfile')

module.exports = {
  get,
  set,
  reset
}

async function get () {
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

async function set () {
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
    const answers = await inquirer.prompt(prompts)
    // from the selected answers, get the theme directory
    const directory = themes.find(scheme => scheme.name == answers.theme).path
    
    // perform the updates
    console.log(`\nUpdating new universal login for ${api.tenantName} tenant from ${answers.theme} theme.`)
    
    // do the widget FIRST and wait for it to complete. Then do the rest of it in parallel.
    await ULwidget.update(api, directory)
    ULtemplate.update(api, directory).then(() => {})
    ULbranding.update(api, directory).then(() => {})
    ULprompts.update(api, directory).then(() => {})
    
    
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
}

async function reset () {
  const scopes = [
    'update:branding',
    'delete:branding'
  ]
  try {
    const api = await management(scopes)

    const directory = themes.find(scheme => scheme.name == 'default').path
    const filename = path.join(directory, `template.html`)
    const branding = path.join(directory, `branding.json`)
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
  } catch (error) {
    console.log('error while updating new universal login.')
    console.error(error)
  }
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
