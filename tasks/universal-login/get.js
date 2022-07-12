const management = require('./../../lib/get-management-client')
const ULbranding = require('./../../lib/ul-branding')
const ULtemplate = require('./../../lib/ul-template')

get()

async function get() {
  try {
    const api = await management([ 'read:branding' ])

    console.log(`\nfetching new universal login settings from ${api.tenantName}\n`)
    const branding = await ULbranding.read(api)
    console.log('\nbranding ...')
    console.log(branding)

    const html = await ULtemplate.read(api)
    console.log('\nhtml template ...')
    console.log(html, '\n')
  } catch (error) {
    console.log(`error while fetching new universal login settings from ${api.tenantName}.`)
    console.error(error)
  }
}
