const express = require("express");

const PORT = 1234;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

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
    res.send('Placeholder')
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
 */