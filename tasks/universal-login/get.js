const management = require('./../../lib/get-management-client')
const ULbranding = require('./../../lib/ul-branding')
const ULwidget = require('./../../lib/ul-widget')
const ULtemplate = require('./../../lib/ul-template')
const ULprompts = require('./../../lib/ul-prompts')

get()

async function get() {
  // prompt user to select tenant, then instantiate the management API client for that tenant
  const scopes = [
    'read:branding',
    'read:prompts'
  ]
  const api = await management(scopes)

  // fetch the stuff from the tenant in paralell ...
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

  ULprompts.read(api).then(prompts => {
    if (prompts) {
      console.log('\nprompts ...')
      console.log(prompts)
    }
  })
}
