const OPERATORS = /[x/+-]/;
const ENDS_WITH_OPERATOR = /[x+-/]$/;
const ENDS_WITH_NEGATIVE = /[x/+]-$/;


class Button extends React.Component{
    render () {
        return (
            <div id="calculator-buttons">
                <button id="clear" className="buttons" value="c" onClick={this.props.clear}>C</button>
                <button id="divide" className="buttons" value="/" onClick={this.props.operators}>÷</button>
                <button id="multiply" className="buttons" value="x" onClick={this.props.operators}>x</button>
                <button id="seven" className="buttons" value="7" onClick={this.props.numbers}>7</button>
                <button id="eight" className="buttons" value="8" onClick={this.props.numbers}>8</button>
                <button id="nine" className="buttons" value="9" onClick={this.props.numbers}>9</button>
                <button id="subtract" className="buttons" value="-" onClick={this.props.operators}>-</button>
                <button id="four" className="buttons" value="4" onClick={this.props.numbers}>4</button>
                <button id="five" className="buttons" value="5" onClick={this.props.numbers}>5</button>
                <button id="six" className="buttons" value="6" onClick={this.props.numbers}>6</button>
                <button id="add" className="buttons" value="+" onClick={this.props.operators}>+</button>
                <button id="one" className="buttons" value="1" onClick={this.props.numbers}>1</button>
                <button id="two" className="buttons" value="2" onClick={this.props.numbers}>2</button>
                <button id="three" className="buttons" value="3" onClick={this.props.numbers}>3</button>
                <button id="equals" className="buttons" value="=" onClick={this.props.equals}>=</button>
                <button id="zero" className="buttons" value="0" onClick={this.props.numbers}>0</button>
                <button id="decimal" className="buttons" value="." onClick={this.props.decimal}>.</button>
            </div>
        )
    }
    
}

class Calculator extends React.Component{
    constructor (props) {
        super(props);
        this.state = {
            currentVal: "",
            prevVal: "", 
            currentSign: "+",
            operation: "",
            lastClicked: "",
        };
        this.clear = this.clear.bind(this);
        this.maxDigit = this.maxDigit.bind(this);
        this.handleNumbers = this.handleNumbers.bind(this);
        this.handleOperators = this.handleOperators.bind(this);
        this.handleEquals = this.handleEquals.bind(this);
        this.handleDecimal = this.handleDecimal.bind(this);
    }

    clear () {
        this.setState({
            currentVal: "0",
            prevVal: "0", 
            currentSign: "+",
            operation: "",
            lastClicked: "",
            calculated: false
        })
    }

    maxDigit () {
        this.setState({
            currentVal: "Digital Limit Met",
            prevVal: this.state.currentVal
        });
        setTimeout(() => {
            this.setState({
                currentVal: this.state.prevVal
            })
        }, 1200);
    }

    handleNumbers (e) {
        if (!this.state.currentVal.includes("Limit")) {
            const {currentVal, operation, calculated} = this.state;
            const value = e.target.value;
            this.setState({calculated: false});
            if (currentVal.length > 10) {
                this.maxDigit();
            } else if (calculated) {
                this.setState({
                    currentVal: value,
                    operation: value !== "0" ? value: ""
                });
            } else {
                this.setState({
                    currentVal: currentVal === "0" || OPERATORS.test(currentVal) ? value : currentVal + value,
                    operation: currentVal === "0" && value === "0" ? operation === "" ? value : operation : /([^.0-9]0|^0)$/.test(operation) ? operation.slice(0, -1) + value : operation + value
                });
            }
        }
    }

    handleOperators (e) {
        if (!this.state.currentVal.includes("Limit")) {
            const value = e.target.value;
            const {operation, prevVal, calculated} = this.state;
            this.setState({
                currentVal: value,
                calculated: false
            });
            if (calculated) {
                this.setState({
                    operation: prevVal + value
                });
            } else if (!ENDS_WITH_OPERATOR.test(operation)) {
                this.setState({
                    prevVal: operation,
                    operation: operation + value
                });
            } else if (!ENDS_WITH_NEGATIVE.test(operation)) {
                this.setState({
                    operation: (ENDS_WITH_NEGATIVE.test(operation + value) ? operation : prevVal) + value
                });
            } else if (value !== "-") {
                this.setState({
                    operation: prevVal + value
                });
            }
        }
    }

    handleEquals (){
        if (!this.state.currentVal.includes("Limit")) {
            let expression = this.state.operation;
            while (ENDS_WITH_OPERATOR.test(expression)) {
              expression = expression.slice(0, -1);
            }
            expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
            let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
            this.setState({
              currentVal: answer.toString(),
              operation: expression.replace(/\*/g, ".").replace(/-/g, "‑") + "=" + answer,
              prevVal: answer,
              calculated: true
            });
          }
    }

    handleDecimal () {
        if (this.state.calculated === true) {
            this.setState({
                currentVal: "0.",
                operation: "0.", 
                calculated: false
            });
        } else if (!this.state.currentVal.includes("Limit") && !this.state.currentVal.includes(".")) {
            this.setState({
                calculated: false
            });
            if (this.state.currentVal.length > 10) {
                this.maxDigit();
            } else if (ENDS_WITH_OPERATOR.test(this.state.operation) || (this.state.currentVal === "0" && this.state.operation === "")) {
                this.setState({
                    currentVal: "0.", 
                    operation: this.state.operation + "0."
                });
            } else {
                this.setState({
                    currentVal: this.state.operation.match(/(-?\d+\.?\d*)$/)[0] + ".", 
                    operation: this.state.operation + "."
                });
            }
        }
    }


    render () {
        return (
            <div id="calculator">
                <div id="display">{this.state.currentVal}</div>
                <Button 
                    numbers={this.handleNumbers} 
                    clear={this.clear} 
                    operators={this.handleOperators} 
                    decimal={this.handleDecimal} 
                    equals={this.handleEquals}
                />
            </div>
        )
    }
}

ReactDOM.render(<Calculator/>, document.getElementById("root"));