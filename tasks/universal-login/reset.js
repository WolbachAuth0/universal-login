const scopes = [
  'delete:branding'
]
const management = require('./../get-management-client')(scopes)

reset()

async function reset() {
  console.log('resetting new universal login html template ...')
  try {
    const response = await management.deleteBrandingUniversalLoginTemplate()
    console.log('success', response)
  } catch (err) {
    console.log('error while deleting new universal login template.')
    console.error(err)
  }
}