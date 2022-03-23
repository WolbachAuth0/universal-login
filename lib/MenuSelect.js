const readline = require("readline")

class MenuSelect {
  constructor(opts = {
    question: '',
    options: [],
    answers: [],
    color: 'blue'
  }) {
    let { question, options, answers, color } = opts
    if (question.length <= 0)
      throw Error(`There must be a 'question'`)
    if (options.length <= 0)
      throw Error(`There must be 'options'`)
    if (answers.length <= 0)
      throw Error(`There must be 'answers'`)
    if (options.length !== answers.length)
      throw Error(`'answers' and 'options' must be of the same length`)

    if (color === undefined) { color = 'blue' }
    
    this._question = question
    this._options = options
    this._answers = answers

    this._color = color
    this.input
    this._selection
    this._answer
  }
  get question () { return this._question }
  set question (value) { this._question = value }

  get options () { return this._options }
  set options (value) { this._options = value }

  get answers () { return this._answers }
  set answers (value) { this._answers = value }

  get selection () { return this._selection }
  set selection (value) { this._selection = value }

  get answer () { return this._answer }
  set answer (value) { this._answer = value }

  get terminal () { return this._terminal }
  
  get prompt () {
    let prompt = `${this.question}:\n`
    this.input = 0
    for (let opt = 0; opt < this.options.length; opt++) {
      const option = `* ${this.options[opt]}\n`
      if (opt === 0) {
        prompt += this.colors(option, 'blue')
      } else {  
        prompt += option
      }  
    }
    prompt += '> '
    return prompt
  }

  async start() {
    this._terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    // process.stdin.on('data', this.handleResponse(this))

    readline.emitKeypressEvents(process.stdin, this.terminal)
    if (process.stdin.isTTY) { process.stdin.setRawMode(true) }

    readline.moveCursor(process.stdout, 0, -this.options.length)
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else if (!key.ctrl && key.name === 'up') {
        this.upArrow()
      } else if (!key.ctrl && key.name === 'down') {
        this.downArrow()
      }
    })

    return new Promise(resolve => {
      return this.terminal.question(this.prompt, text => {
        this.terminal.close()
        resolve({ text, input: this.input })
      })
    })
  }

  handleResponse(self) {
    return (c) => {
      switch (c) {
        case '\u001b[A':      // up arrow
          return self.upArrow()
        case '\u001b[B':      // down arrow
          return self.downArrow()
      }
    }
  }

  upArrow () {
    let { rows, cols } = this.terminal.getCursorPos()
    // console.log({ rows, cols, input: this.input })
    if (this.input == 0) {
      this.input = this.options.length - 1
      readline.moveCursor(process.stdout, 0, this.options.length - 1)
    } else {
      this.input -= 1
      readline.moveCursor(process.stdout, 0, -1)
    }

    
    // rdl.cursorTo(stdout, 0, y)
    // stdout.write(this.options[y - 1])
    // if (this.cursorLocs.y === 1) {
    //   this.cursorLocs.y = this.options.length
    // } else {
    //   this.cursorLocs.y--
    // }
    // y = this.cursorLocs.y
    // rdl.cursorTo(stdout, 0, y)
    // stdout.write(this.color(this.options[y - 1], this._color))
    // this.input = y - 1
  }

  downArrow () {
    let { rows, cols } = this.terminal.getCursorPos()
    // console.log({ rows, cols, input: this.input })
    if (this.input == this.options.length - 1) {
      this.input = 0
      readline.moveCursor(process.stdout, 0, 0)
    } else {
      this.input -= 1
      readline.moveCursor(process.stdout, 0, 1)
    }
  }

  colors (str, colorName = "yellow") {
    const colors = {
      "yellow": [33, 89],
      "blue": [34, 89],
      "green": [32, 89],
      "cyan": [35, 89],
      "red": [31, 89],
      "magenta": [36, 89]
    }
    const _color = colors[colorName]
    const start = "\x1b[" + _color[0] + "m"
    const stop = "\x1b[" + _color[1] + "m\x1b[0m"
    return start + str + stop
  }
}

module.exports = MenuSelect