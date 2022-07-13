const management = require('./../../lib/get-management-client')
const ULbranding = require('./../../lib/ul-branding')
const ULwidget = require('./../../lib/ul-widget')
const ULtemplate = require('./../../lib/ul-template')

get()

async function get() {

  const api = await management([ 'read:branding' ])

  // fetch the stuff from the tenant ...
  const branding = await ULbranding.read(api)
  const widget = await ULwidget.read(api)
  const html = await ULtemplate.read(api)

  // log it to console ...
  if (branding) {
    console.log('\nbranding ...')
    console.log(branding)
  }
  if (widget) {
    console.log('\nwidget ...')
    console.log(widget)
  }
  if (html) {
    console.log('\nhtml template ...')
    console.log(html)
  }
 
}
