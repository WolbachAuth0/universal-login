const management = require('./../lib/get-management-client')

main()

async function main () {
  // prompt user to select tenant, then instantiate the management API client for that tenant
  const scopes = [
    'read:users',
    'read:user_idp_tokens'
  ]
  const api = await management(scopes)
  const query = `email:"aaron.wolbach@okta.com" AND identities.connection:"google-oauth2"`
  const searchResponse = await api.users.getAll({ q: query })

  const found_user_id = searchResponse[0].user_id || null

  console.log('\n',found_user_id, '\n')
}
