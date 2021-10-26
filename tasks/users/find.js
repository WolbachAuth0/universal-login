const args = process.argv.slice(2)
const re = /^email=(.*)$/

if (!args.length > 0 || !args.some(x => x.match(re))) {
  console.log('must include an email parameter. example ...')
  console.log('npm run find-user email=aaron.wolbach@auth0.com')
  console.log(args)
  process.exit(0)
}
const param = args.filter(x => x.match(re))[0]
const email = re.exec(param)[1]

const scopes = [
  'read:users',
  'read:user_idp_tokens',
  'create:users'
]
const management = require('./../get-management-client')(scopes)

getUsersByEmail(email)

async function getUsersByEmail(email) {
  console.log(`getting users associated to email address ${email} ...`)
  try {
    const users = await management.getUsersByEmail(email)
    console.log('success:', JSON.stringify(users, null, 2))
  } catch (err) {
    console.log('error while fetching users by email ...')
    console.error(err)
  }
}