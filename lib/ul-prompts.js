const fs = require('fs')
const path = require('path')
const filename = 'prompts.json'

module.exports = {
  read,
  update,
  filename
}

const defaultprompts = {
  'login': {},
  'login-id': {},
  'login-email-verification': {},
  'signup': {},
  'signup-id': {},
  'signup-password': {},
  'reset-password': {},
  'consent': {},
  'mfa-push': {},
  'mfa-otp': {},
  'mfa-voice': {},
  'mfa-phone': {},
  'mfa-webauthn': {},
  'mfa-sms': {},
  'mfa-email': {},
  'mfa-recovery-code': {},
  'mfa': {},
  'status': {},
  'device-flow': {},
  'email-verification': {},
  'email-otp-challenge': {},
  'organizations': {},
  'invitation': {},
  'common': {},
}

function getJSON (directory) {
  const filepath = path.join(directory, filename)
  return fs.existsSync(filepath) ? require(filepath) : null
}

function themeName(directory) {
  const tokens = directory.split('/')
  return tokens[tokens.length - 1]
}

async function read(api) {
  let result = {}
  try {
    
    for (let name of Object.keys(defaultprompts)) {
      console.log(`fetching ${name} screen text prompts from ${api.tenantName} ...`)
      const params = {
        prompt: name,
        language: 'en'
      }
      const response = await api.prompts.getCustomTextByLanguage(params)
      if (Object.keys(response).length > 0) {
        result[name] = response
      }
    }

    return result
  } catch (err) {
    console.log(`\nerror while getting text prompts from ${api.tenantName}.`)
    console.error(err)
  }
}

// set the prompts
// See ... https://auth0.github.io/node-auth0/ManagementClient.html#updateCustomTextByLanguage
// and ... https://auth0.com/docs/customize/universal-login-pages/customize-login-text-prompts
async function update (api, directory) {
  try {
    const json = getJSON(directory)
    const theme = themeName(directory)
    if (json) {
      const keys = Object.keys(json)

      for (let prompt of keys) {
        let body = {}
        body[prompt] = json[prompt]
        const params = {
          prompt,
          language: 'en',
          body
        }
        const response = await api.prompts.updateCustomTextByLanguage(params)
        console.log(`\nsuccess set login prompts for ${prompt} screen`)
        console.log(response)
      }
    } else {
      console.log(`\na prompts.json file was not found for the ${theme} theme.`)
    }
  } catch (error) {
    console.log('error while updating new universal login prompts.')
    throw error
  }
}