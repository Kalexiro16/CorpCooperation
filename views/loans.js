document.addEventListener('DOMContentLoaded', function () {
    const loanForm = document.getElementById('loanForm');
    const loanList = document.getElementById('loanList');
    const createNewLoanButton = document.getElementById('createNewLoan');
    const saveLoanButton = document.getElementById('saveLoanDetails');
    const loanDetails = document.getElementById('loanDetails');
    const progressBar = document.getElementById('progressBar');
    const interestCalculation = document.getElementById('interestCalculation');
    const repaymentPlans = document.getElementById('repaymentPlans');
    const newInstallmentSection = document.getElementById('newInstallmentSection');
    const remainingAmount = document.getElementById('remainingAmount');

    let currentLoanId = null;

    createNewLoanButton.addEventListener('click', function () {
        currentLoanId = `loan${Date.now()}`;
        clearLoanForm();
        loanForm.classList.remove('hidden');
        loanDetails.classList.add('hidden');
        interestCalculation.classList.add('hidden');
        repaymentPlans.classList.add('hidden');
        newInstallmentSection.classList.add('hidden');
        remainingAmount.classList.add('hidden');
    });

    saveLoanButton.addEventListener('click', function () {
        const totalLoanAmount = document.getElementById('totalLoanAmount').value;
        const loanApprovedDate = document.getElementById('loanApprovedDate').value;
        const interestRate = document.getElementById('interestRate').value;
        const repaymentYears = document.getElementById('repaymentYears').value;
        const amountPaid = document.getElementById('amountPaid').value;

        const loanData = {
            totalLoanAmount,
            loanApprovedDate,
            interestRate,
            repaymentYears,
            amountPaid
        };

        try {
            localStorage.setItem(currentLoanId, JSON.stringify(loanData));
            displayLoans();
            displayLoanDetails(currentLoanId);
        } catch (error) {
            console.error('Error saving loan data:', error);
        }
    });

    function displayLoans() {
        loanList.innerHTML = '';
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('loan')) {
                try {
                    const loanData = JSON.parse(localStorage.getItem(key));
                    const loanItem = document.createElement('li');
                    loanItem.innerText = `Loan: ${loanData.totalLoanAmount}`;
                    loanItem.addEventListener('click', function () {
                        currentLoanId = key;
                        displayLoanDetails(currentLoanId);
                    });
                    loanList.appendChild(loanItem);
                } catch (error) {
                    console.error('Error parsing loan data:', error);
                }
            }
        }
    }

    function displayLoanDetails(loanId) {
        try {
            const loanData = JSON.parse(localStorage.getItem(loanId));
            document.getElementById('displayTotalLoanAmount').innerText = `Total Loan Amount: ${loanData.totalLoanAmount}`;
            document.getElementById('displayLoanApprovedDate').innerText = `Loan Approved Date: ${new Date(loanData.loanApprovedDate).toLocaleDateString()}`;
            document.getElementById('displayInterestRate').innerText = `Interest Rate: ${loanData.interestRate}%`;
            document.getElementById('displayRepaymentYears').innerText = `Repayment Period: ${loanData.repaymentYears} years`;

            const percentage = (loanData.amountPaid / loanData.totalLoanAmount) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.innerText = `${percentage.toFixed(2)}%`;

            const remainingLoan = loanData.totalLoanAmount - loanData.amountPaid;
            remainingAmount.innerText = `Remaining Amount to Repay: ${remainingLoan.toFixed(2)}`;

            loanForm.classList.add('hidden');
            loanDetails.classList.remove('hidden');
            interestCalculation.classList.remove('hidden');
            repaymentPlans.classList.remove('hidden');
            newInstallmentSection.classList.remove('hidden');
            remainingAmount.classList.remove('hidden');
        } catch (error) {
            console.error('Error displaying loan details:', error);
        }
    }

    document.getElementById('addInstallment').addEventListener('click', function () {
        const newInstallmentAmount = parseFloat(document.getElementById('newInstallmentAmount').value);
        const loanData = JSON.parse(localStorage.getItem(currentLoanId));
        loanData.amountPaid = (parseFloat(loanData.amountPaid) + newInstallmentAmount).toFixed(2);

        localStorage.setItem(currentLoanId, JSON.stringify(loanData));

        displayLoanDetails(currentLoanId);
        calculateInterest();
    });

    document.getElementById('calculateInterest').addEventListener('click', function () {
        calculateInterest();
    });

    function calculateInterest() {
        const loanData = JSON.parse(localStorage.getItem(currentLoanId));
        const interestRate = parseFloat(loanData.interestRate);
        const paymentAmount = parseFloat(document.getElementById('paymentAmount').value);
        const totalLoanAmount = parseFloat(loanData.totalLoanAmount);
        const amountPaid = parseFloat(loanData.amountPaid);

        const remainingLoan = totalLoanAmount - amountPaid;
        const monthlyInterestRate = interestRate / 100 / 12;
        const interest = remainingLoan * monthlyInterestRate;

        document.getElementById('interestDetails').innerText = `Interest for Next Payment: ${interest.toFixed(2)}`;

        generateRepaymentPlans(remainingLoan, monthlyInterestRate);
    }

    function generateRepaymentPlans(remainingLoan, monthlyInterestRate) {
        const plansContainer = document.getElementById('plansContainer');
        plansContainer.innerHTML = '';

        const plans = [6, 12, 24, 36];
        plans.forEach(months => {
            const monthlyPayment = (remainingLoan * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -months));
            const totalPayment = monthlyPayment * months;
            const totalInterest = totalPayment - remainingLoan;

            const planCard = document.createElement('div');
            planCard.classList.add('card');
            planCard.innerHTML = `
                <h3>${months} Months Plan</h3>
                <p>Monthly Payment: ${monthlyPayment.toFixed(2)}</p>
                <p>Total Interest: ${totalInterest.toFixed(2)}</p>
            `;

            plansContainer.appendChild(planCard);
        });
    }

    function clearLoanForm() {
        document.getElementById('totalLoanAmount').value = '';
        document.getElementById('loanApprovedDate').value = '';
        document.getElementById('interestRate').value = '';
        document.getElementById('repaymentYears').value = '';
        document.getElementById('amountPaid').value = '';
    }

    displayLoans();
});
