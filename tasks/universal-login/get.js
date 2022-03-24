const management = require('./../../lib/get-management-client')

get()

async function get() {
  const scopes = [ 'read:branding' ]
  const client = await management(scopes)

  console.log('fetching new universal login settings and template ...\n')
  try {
    const settings = await client.getBrandingSettings()
    console.log(settings)
  } catch (err) {
    console.log('error while getting new universal login settings.')
    console.error(err)
  }
  console.log('')
  try {
    const template = await client.getBrandingUniversalLoginTemplate()
    console.log(template.body)
  } catch (err) {
    if (err?.statusCode == 404) {
      console.log('There currently is no html template for the new universal login.')
    } else {
      console.log('error while getting new universal login template ...')
      console.error(err)
    }
  }
}
