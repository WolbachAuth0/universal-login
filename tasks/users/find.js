const scopes = [
  'read:users',
  'read:user_idp_tokens',
]
const management = require('./../../lib/get-management-client')

const args = process.argv.slice(2)
const emailRE = /^email=(.*)$/
const idRE = /^id=(.*)$/

findUser()

async function findUser() {
  const scopes = [
    'read:users',
    'read:user_idp_tokens',
  ]
  
  try {
    const api = await management(scopes)
    
  } catch (error) {
    
  }
}


if ( !args.length > 0 || !args.some(x => x.match(emailRE) || x.match(idRE)) ) {
  console.log('must include an email or an id parameter. example ...')
  console.log('npm run find:users email="aaron.wolbach@auth0.com"')
  console.log('npm run find:users id="auth0|YWFyb24ud29sYmFjaEBnbWFpbC5jb200d29sYmFjaC0zNDY4"')
  console.log(args)
  process.exit(0)
} else if ( args.some(x => x.match(idRE)) ) {
  const param = args.filter(x => x.match(idRE))[0]
  const id = idRE.exec(param)[1]
  getUserByID(id)
} else if ( args.some(x => x.match(emailRE)) ) {
  const param = args.filter(x => x.match(emailRE))[0]
  const email = emailRE.exec(param)[1]
  getUsersByEmail(email)
}

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

async function getUserByID(id) {
  console.log(`getting users with user_id=${id} ...`)
  try {
    const users = await management.getUser({ id })
    console.log('success:', JSON.stringify(users, null, 2))
  } catch (err) {
    console.log('error while fetching users by email ...')
    console.error(err)
  }
}
