const path = require('path')
const inquirer = require('inquirer')
const tenants = require('./../tenants')
const auth0 = require('auth0')

module.exports = function (scopes) {
return inquirer
  .prompt([
    {
      type: 'list',
      name: 'name',
      message: 'Select the Auth0 tenant:',
      choices: tenants.map(tenant => tenant.name),
    },
  ])
  .then((answer) => {
    // get the path to the chosen tenant's environment file
    const directory = tenants.find(tenant => tenant.name == answer.name).path
    const filename = path.join(directory, `./.env`)

    // load the environment
    console.log(`Loading environment variables for the ${answer.name} tenant ... `)
    require('dotenv').config({ path: filename })

    // initialize the management API client for the chosen tenant
    const options = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      scope: scopes.join(' ')
    }
    const ManagementClient = auth0.ManagementClient
    const management = new ManagementClient(options)
    return management
  })
  .catch(error => {
    console.log('An error occurred while instantiating management api client.')
    console.error(error)
    console.log('exiting process.')
    console.log('')
    process.exit(1)
  })
}
