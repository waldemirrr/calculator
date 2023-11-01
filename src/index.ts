import "./styles.scss"

class Calculator {
    constructor(
        private firstOperand = "",
        private secondOperand = "",
        private operator: null | string = null,
        private result = "",
        public maximumInputLength = 30,
        public maximumOperandLength = 19,
        public maximumResultLength = 11,
        private firstOperandElement = document.querySelector(".display__firstOperand") as HTMLElement,
        private secondOperandElement = document.querySelector(".display__secondOperand") as HTMLElement,
        private operatorElement = document.querySelector(".display__operator") as HTMLElement,
        private resultElement = document.querySelector(".display__result") as HTMLElement,
        private buttons = document.querySelector(".number-pad") as HTMLElement
    ) {
        this.setEvents()
    }

    setEvents = () => {
        this.buttons.addEventListener("click", (e: Event) => {
            const element = e.target as HTMLElement
            if (element.classList.contains("number-pad__operand")) this.addNumber(element.textContent!)
            if (element.classList.contains("number-pad__operator")) this.addOperator(element.textContent!)
            if (element.classList.contains("number-pad__clear-all")) this.clearAll()
            if (element.classList.contains("number-pad__delete")) this.delete()
            if (element.classList.contains("number-pad__plus-minus")) this.plusMinus()
            if (element.classList.contains("number-pad__equal")) this.calculate()
            this.updateDisplay()
            this.inputFontShrink()
        })
    }

    removeLeadingZeros = (string: string): string => {
        if (string === '.' || string.slice(-1) === '.') return string
        const removedLeadingZeros = +string
        return removedLeadingZeros.toString()
    }

    isInputTooLong = () => {
        if (this.firstOperand.length >= this.maximumOperandLength || this.secondOperand.length >= this.maximumOperandLength) return true
        return this.firstOperand.length + this.secondOperand.length > this.maximumInputLength
    }

    resultFontShrink = (computedResult: number) => {
        if (computedResult.toString().length >= this.maximumResultLength) {
            this.resultElement!.classList.add("display__result_font-small")
        } else {
            this.resultElement!.classList.remove("display__result_font-small")
        }
    }

    inputFontShrink = () => {
        if (this.firstOperand.length + this.secondOperand.length >= this.maximumOperandLength) {
            this.firstOperandElement!.classList.add("display__firstOperand_font-small")
            this.operatorElement!.classList.add("display__operator_font-small")
            this.secondOperandElement!.classList.add("display__secondOperand_font-small")
        } else {
            this.firstOperandElement!.classList.remove("display__firstOperand_font-small")
            this.operatorElement!.classList.remove("display__operator_font-small")
            this.secondOperandElement!.classList.remove("display__secondOperand_font-small")
        }
    }

    isPointPresent = (symbol: string) => {
        if (symbol !== ".") return false
        return this.secondOperand.includes(".") || this.firstOperand.includes(".") && this.operator === null
    }

    updateDisplay = () => {
        this.firstOperandElement.textContent = this.firstOperand
        this.operatorElement.textContent = this.operator
        this.secondOperandElement.textContent = this.secondOperand
        this.resultElement.textContent = this.result
    }

    addNumber = (symbol: string) => {
        if (this.isInputTooLong()) return
        if (this.isPointPresent(symbol)) return
        if (this.result) this.clearAll()
        if (this.operator === null) return this.firstOperand = this.removeLeadingZeros(this.firstOperand.concat(symbol))
        this.secondOperand = this.removeLeadingZeros(this.secondOperand.concat(symbol))
    }

    addOperator = (operator: string) => {
        if(this.isInputTooLong()) return
        if (this.result) {
            this.firstOperand = this.result
            this.result = ""
        }
        if (this.firstOperand === "." || this.firstOperand === "") return
        this.operator = operator
    }

    clearAll = () => {
        this.firstOperand = ""
        this.secondOperand = ""
        this.operator = null
        this.result = ""
    }

    delete = () => {
        if(this.operator === null && this.firstOperand.slice(0, -1) === "-") return this.firstOperand = ""
        if (this.operator === null) return this.firstOperand = this.firstOperand.slice(0, -1)
        if (this.secondOperand === "") return this.operator = null
        if(this.secondOperand.slice(0, -1) === "-") this.secondOperand = ""
        this.secondOperand = this.secondOperand.slice(0, -1)
    }

    plusMinus = () => {
        if(!(this.firstOperand === "" || this.firstOperand === ".") && this.operator === null) return this.firstOperand = (parseFloat(this.firstOperand) * -1).toString()
        if (!(this.secondOperand === "" || this.secondOperand === ".") && this.operator) return this.secondOperand = (parseFloat(this.secondOperand) * -1).toString()
    }

    calculate = () => {
        if (this.operator === null) return
        if (this.secondOperand === "." || this.secondOperand === "") return
        let computedResult: number
        const first = parseFloat(this.firstOperand)
        const second = parseFloat(this.secondOperand)
        switch (this.operator) {
            case "/":
                computedResult = first / second
                break
            case "*":
                computedResult = first * second
                break
            case "-":
                computedResult = first - second
                break
            case "+":
                computedResult = first + second
                break
            default:
                return
        }
        this.resultFontShrink(computedResult)
        this.result = parseFloat(computedResult.toFixed(6)).toString()
        this.firstOperand = ""
        this.operator = null
        this.secondOperand = ""
    }
}

const calculator = new Calculator()