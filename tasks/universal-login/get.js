const scopes = [
  'read:branding'
]
const management = require('./../get-management-client')(scopes)
get()

async function get() {
  console.log('fetching new universal login settings and template ...')
  try {
    const settings = await management.getBrandingSettings()
    console.log(settings)
  } catch (err) {
    console.log('error while getting new universal login settings.')
    console.error(err)
  }

  try {
    const template = await management.getBrandingUniversalLoginTemplate()
    console.log(template)
  } catch (err) {
    
    if (err?.statusCode == 404) {
      console.log('There currently is no html template for the new universal login.')
    } else {
      console.log('error while getting new universal login template ...')
      console.error(err)
    }
  }
}
