const inquirer = require('inquirer')
const universalLogin = require('./tasks/universal-login')
main()

async function main () {
  const choices = [
    'READ the Universal Login for a CIC Tenant.',
    'UPDATE the Universal Login for a CIC Tenant.',
    'RESET the Universal Login for a CIC Tenant to default.'
  ]
  const choice = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'name',
        message: 'What would you like to do?',
        choices,
        default: 'READ the Universal Login for a CIC Tenant.'
      }
    ])

  if (choice.name == choices[0]) {
    await universalLogin.get()
  } else if (choice.name == choices[1]) {
    await universalLogin.set()
  } else {
    await universalLogin.reset()
  }
}