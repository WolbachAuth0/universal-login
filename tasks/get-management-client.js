const path = require('path')
console.log(`Reading environment from .env.dev ...`)
require('dotenv').config({ path: path.join(__dirname, `./../.env.dev`) })

module.exports = function (scopes) {
  try {
    const options = {
      domain: process.env.AUTH0_DOMAIN,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
      scope: scopes.join(' ')
    }
    
    const ManagementClient = require('auth0').ManagementClient
    const management = new ManagementClient(options)
    return management
  } catch (err) {
    console.log('An error occurred while instantiating management api client.')
    console.error(err)
    console.log('exiting process.')
    console.log('')
    process.exit(1)
  }
}
