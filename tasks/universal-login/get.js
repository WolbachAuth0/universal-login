const management = require('./../../lib/get-management-client')
const ULbranding = require('./../../lib/ul-branding')
const ULwidget = require('./../../lib/ul-widget')
const ULtemplate = require('./../../lib/ul-template')

get()

async function get() {

  const api = await management([ 'read:branding' ])

  // fetch the stuff from the tenant ...
  ULbranding.read(api).then(branding => {
    if (branding) {
      console.log('\nbranding ...')
      console.log(branding)
    }
  })

  ULwidget.read(api).then(widget => {
    if (widget) {
      console.log('\nwidget ...')
      console.log(widget)
    }
  })

  ULtemplate.read(api).then(html => {
    if (html) {
      console.log('\nhtml template ...')
      console.log(html)
    }
  })

}
