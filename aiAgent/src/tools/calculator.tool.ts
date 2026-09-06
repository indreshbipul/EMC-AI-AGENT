export type CalculatorResponse = {
    status: "success" | "failed";
    message: string;
    result?: number;
};

const calculator = async (expression: string): Promise<CalculatorResponse> => {
    try {
        // Only allow numbers, operators, decimal points,
        // parentheses, whitespace and %
        if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
            return {
                status: "failed",
                message: "Invalid characters in expression"
            };
        }
        const tokens = expression.match(
            /(\d+(?:\.\d+)?|[()+\-*/%])/g
        );

        if (!tokens) {
            return {
                status: "failed",
                message: "Invalid expression"
            };
        }

        let index = 0;
        const peek = () => tokens[index];
        const consume = () => tokens[index++];
        const parseExpression = (): number => {
            let value = parseTerm();

            while (peek() === "+" || peek() === "-") {
                const operator = consume();
                const right = parseTerm();
                if (operator === "+") {
                    value += right;
                } else {
                    value -= right;
                }
            }

            return value;
        };

        const parseTerm = (): number => {
            let value = parseFactor();

            while (
                peek() === "*" ||
                peek() === "/" ||
                peek() === "%"
            ) {
                const operator = consume();
                const right = parseFactor();
                if (operator === "*") {
                    value *= right;
                } else if (operator === "/") {
                    if (right === 0) {
                        throw new Error("Division by zero");
                    }

                    value /= right;
                } else {
                    value %= right;
                }
            }

            return value;
        };
        const parseFactor = (): number => {
            if (peek() === "-") {
                consume();
                return -parseFactor();
            }

            if (peek() === "(") {
                consume();
                const value = parseExpression();
                if (consume() !== ")") {
                    throw new Error("Missing closing parenthesis");
                }
                return value;
            }
            const token = consume();
            if (!token) {
                throw new Error("Unexpected end of expression");
            }
            const value = Number(token);

            if (Number.isNaN(value)) {
                throw new Error(`Invalid number: ${token}`);
            }
            return value;
        };
        const result = parseExpression();
        if (index !== tokens.length) {
            throw new Error(
                `Unexpected token: ${tokens[index]}`
            );
        }
        if (!Number.isFinite(result)) {
            throw new Error("Result is not a finite number");
        }
        return {
            status: "success",
            message: String(result),
            result
        };
    } catch (err) {
        return {
            status: "failed",
            message: err instanceof Error
                ? err.message
                : String(err)
        };
    }
};

export default calculator