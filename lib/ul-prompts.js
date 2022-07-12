const fs = require('fs')
const path = require('path')

module.exports = {
  update
}

function getData(directory) {
  const filename = path.join(directory, `prompts.json`)
  return fs.existsSync(filename) ? require(filename) : null
}

function themeName(directory) {
  const tokens = directory.split('/')
  return tokens[tokens.length - 1]
}

// set the prompts
// See ... https://auth0.github.io/node-auth0/ManagementClient.html#updateCustomTextByLanguage
// and ... https://auth0.com/docs/customize/universal-login-pages/customize-login-text-prompts
async function update (api, directory) {
  try {
    const data = getData(directory)
    const theme = themeName(directory)
    if (data) {
      const keys = Object.keys(data)

      for (let prompt of keys) {
        let body = {}
        body[prompt] = data[prompt]
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