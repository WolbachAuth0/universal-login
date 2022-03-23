const readline = require('readline')
const stdin = process.stdin
const stdout = process.stdout
const schemes = require('./tasks/universal-login/schemes')
const MenuSelect = require('./lib/MenuSelect')

go()

async function go() {
  const menu = new MenuSelect({
    question: 'Select the universal login theme from the available templates:',
    options: schemes.map(scheme => scheme.name),
    answers: schemes.map(scheme => scheme.path),
    color: 'blue',
  })
  const response = await menu.start()
  console.log(`you responded with:`)
  console.log(response)

  menu.terminal.on('close', () => {
    console.log('Have a great day!')
    process.exit(0)
  })
}


// let prompt = `Select a scheme:\n`

// for (let opt = 0; opt < schemes.length; opt++) {
//   const option = `* ${schemes[opt].name}\n`
//   if (opt === schemes.length - 1) {
//     prompt += color(option, 'blue')
//   } else {  
//     prompt += option
//   }  
// }
// prompt += '> '

// const rl = readline.createInterface({ input: stdin, output: stdout, prompt: prompt })

// rl.prompt()

// stdin.on('data', )

// rl.on('line', (line) => {
//   switch (line.trim()) {
//     case 'hello':
//       console.log('world!')
//       break
//     default:
//       console.log(`Say what? I might have heard '${line.trim()}'`)
//       break
//   }
//   rl.prompt()
// }).on('close', () => {
//   console.log('Have a great day!')
//   process.exit(0)
// });

function color(str, colorName = 'yellow') {
  const colors = {
    'yellow': [33, 89],
    'blue': [34, 89],
    'green': [32, 89],
    'cyan': [35, 89],
    'red': [31, 89],
    'magenta': [36, 89]
  }
  const _color = colors[colorName]
  const start = '\x1b[' + _color[0] + 'm'
  const stop = '\x1b[' + _color[1] + 'm\x1b[0m'
  return start + str + stop
}