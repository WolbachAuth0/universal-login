const scopes = [
  'delete:branding',
  'update:branding',
]
const management = require('./../get-management-client')(scopes)

// The Travel0 default scheme
const defaultBranding = {
  colors: {
    primary: '#03C07B',
    page_background: '#03C07B'
  },
  logo_url: 'https://d2qcgv1x1k2it7.cloudfront.net/icons/logo/travel0-green.svg'
}

// Management API SDK documentation
// https://auth0.github.io/node-auth0/

reset()

async function reset() {
  console.log('resetting new universal login html template ...')
  try {
    const response = await management.deleteBrandingUniversalLoginTemplate()
    const updateResponse = await management.updateBrandingSettings({}, defaultBranding)
    console.log('success')
    console.log(updateResponse)
  } catch (err) {
    console.log('error while deleting new universal login template.')
    console.error(err)
  }
}