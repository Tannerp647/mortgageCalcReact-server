const express = require("express");
const { use } = require("express/lib/application");
const cors = require('cors')

const PORT = 1234;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/hello", (req, res) => {
    console.log(req.query);
    res.send("Hello world");
});

const testController = (req, res) => {
    const { loanTerm, loanAmount, interestRate } = req.body;

    // validation
    if (!loanTerm || !loanAmount || !interestRate) {
        res.status(400);
        res.send("Parameters missing!");
    }
    try {
        const responseData = {
            loanMonths: loanTerm * 12,
            loanAmount,
            interestRate,
        };
        res.send(responseData);
    } catch (e) {
        res.status(500);
        res.send(e.message)
    }
}

const calculateMortgage = (req, res) => {
    // do your mortgage calculations here
    console.log(req.body);
    const { loanTerm, loanAmount, interestRate } = req.body;

    //make sure that there is a value 
    // if (!loanTerm || !loanAmount || !interestRate) {
    //     res.status(400);
    //     res.send("missing entry")
    // };
    // make sure that they are numbers
    if (typeof loanTerm != "number" || typeof loanAmount != "number" || typeof interestRate != "number") {
        res.status(400);
        res.send("Invalid entry")
    };
    //all the calculations
    const loanMonths = loanTerm * 12;
    const interestRateDecimal = interestRate / 100 / 12;
    const interestRatePlusOne = interestRateDecimal + 1;
    const calcOne = 1 - Math.pow(interestRatePlusOne, - loanMonths);
    const calcTwo = interestRateDecimal / calcOne;
    const monthlyPayment = calcTwo * loanAmount;
    const annualPayment = loanAmount / loanTerm;
    const zero = 0;
    //in case someone has a 0 percent interest rate.
    if (loanAmount && interestRate === 0 && loanTerm)
        try {
            const response = {
                "monthlyPayment": Math.ceil(annualPayment / 12),
                "totalPayment": Math.ceil(loanAmount),
                "totalInterest": 0,
                "annualPayment": Math.ceil(loanAmount / loanTerm),
            }
            res.send(response);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        };

    //the output that will be displayed

    try {
        const response = {
            "monthlyPayment": Math.ceil((monthlyPayment)),
            "totalPayment": Math.ceil((monthlyPayment * loanMonths)),
            "totalInterest": Math.ceil(((monthlyPayment * loanMonths) - loanAmount)),
            "annualPayment": Math.ceil((monthlyPayment * 12)),
        }
        res.send(response);
    } catch (e) {
        res.status(500);
        res.send(e.message);
    };
};


app.post("/test", testController);

app.post("/calculate-mortgage", calculateMortgage);

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
});

/**
 * CRUD Operations
 * Create - POST
 * Read - GET
 * Update - PUT
 * Delete - DELETE
 *
 * endpoints:
 * /hello -> returns hello world
 * /calculate-mortgage -> return mortgage stats
 * /hello?name=george
 **/