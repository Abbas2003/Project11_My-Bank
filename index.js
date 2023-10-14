import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// Customer Class
class Customer {
    name;
    age;
    gender;
    mobileNum;
    accountNumber;
    constructor(name, age, gender, mobileNum, accountNumber) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.mobileNum = mobileNum;
        this.accountNumber = accountNumber;
    }
}
;
// Class Bank
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let updateRec = this.account.filter((acc) => acc.accountNumber !== accObj.accountNumber);
        this.account = [...updateRec, accObj];
    }
}
let myBank = new Bank();
// Customer create
for (let i = 1; i <= 3; i++) {
    let name = faker.person.fullName();
    let number = parseInt(faker.phone.number());
    const cus = new Customer(name, 20 * i, "male", number, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accountNumber: cus.accountNumber, balance: 100 * i });
}
// Bank Functionality
async function bankServices(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "What you wish to do?",
            choices: ["View Balance", "Withdraw Cash", "Deposit Cash", "Exit"]
        });
        // View Balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number: ",
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number!"));
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accountNumber == account?.accountNumber);
                console.log(`Dear ${chalk.green.italic(name?.name)} your account balance is ${chalk.bold.blueBright("$", account.balance)} `);
            }
        }
        // Cash withdraw
        if (service.select == "Withdraw Cash") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number: ",
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: 'Please enter your amount:',
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Sorry! You have insufficient balance"));
                }
                let newBalance = account.balance - ans.rupee;
                // calling Transaction method
                bank.transaction({ accountNumber: account.accountNumber, balance: newBalance });
                // console.log(newBalance)
            }
        }
        // Cash Deposite
        if (service.select == "Deposit Cash") {
            let res = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Please Enter your account number: ",
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number!"));
            }
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: 'Please enter your amount:',
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                // calling Transaction method
                bank.transaction({ accountNumber: account.accountNumber, balance: newBalance });
                console.log(newBalance);
            }
        }
        // Exit
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
bankServices(myBank);
