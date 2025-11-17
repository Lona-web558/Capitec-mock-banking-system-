const MOCK_API = {
    // Single mock user for simplicity
    currentUser: {
        id: 'CAP12345678',
        name: 'Lona Matshingana',
        remotePIN: '1234', // Mock PIN for login
        accounts: [
            {
                type: 'Global One Savings',
                number: '4001234567',
                balance: 15500.75, // Starting balance
                transactions: [
                    { id: 1, date: '2025-11-15', description: 'Initial Deposit', amount: 15000.00, type: 'credit' },
                    { id: 2, date: '2025-11-16', description: 'Woolworths Purchase', amount: -499.25, type: 'debit' }
                ]
            },
            {
                type: 'Flexi Fixed-Term',
                number: '7009876543',
                balance: 50000.00,
                transactions: []
            }
        ],
        lotteryTickets: []
    }
};


// --- Global Data and DOM Elements ---
const MOCK_USER = MOCK_API.currentUser; // Get the mock user data
const USER_PIN_INPUT = document.getElementById('user-pin');
const LOGIN_BTN = document.getElementById('login-btn');
const LOGOUT_BTN = document.getElementById('logout-btn');
const LOGIN_SCREEN = document.getElementById('login-screen');
const DASHBOARD_SCREEN = document.getElementById('dashboard-screen');
const ACCOUNTS_SUMMARY = document.getElementById('accounts-summary');

// --- Main Functions ---

function login() {
    const enteredPin = USER_PIN_INPUT.value;
    if (enteredPin === MOCK_USER.remotePIN) {
        LOGIN_SCREEN.style.display = 'none';
        DASHBOARD_SCREEN.style.display = 'block';
        document.getElementById('user-name').textContent = MOCK_USER.name.split(' ')[0];
        displayAccounts();
        updateLotteryUI();
    } else {
        alert('Invalid PIN. Please try 1234.');
        USER_PIN_INPUT.value = '';
    }
}

function logout() {
    LOGIN_SCREEN.style.display = 'block';
    DASHBOARD_SCREEN.style.display = 'none';
    USER_PIN_INPUT.value = '';
}

function displayAccounts() {
    ACCOUNTS_SUMMARY.innerHTML = ''; // Clear previous cards
    MOCK_USER.accounts.forEach(account => {
        const balanceFormatted = account.balance.toFixed(2);
        const cardHtml = `
            <div class="col-md-6 mb-4">
                <div class="card border-0 shadow-sm account-card" data-account="${account.number}">
                    <div class="card-body">
                        <h5 class="card-title text-danger">${account.type}</h5>
                        <p class="card-text mb-1 text-muted">...${account.number.slice(-4)}</p>
                        <h3 class="card-text">R ${balanceFormatted}</h3>
                    </div>
                </div>
            </div>
        `;
        ACCOUNTS_SUMMARY.innerHTML += cardHtml;
    });
}

// --- Event Listeners ---
LOGIN_BTN.addEventListener('click', login);
LOGOUT_BTN.addEventListener('click', logout);

// --- Lottery Elements ---
const BUY_TICKET_BTN = document.getElementById('buy-ticket-btn');
const DRAW_BTN = document.getElementById('draw-btn');
const LOTTERY_STATUS = document.getElementById('lottery-status');
const TICKET_COST = 500.00;
const MAX_NUMBER = 100;

// Helper to generate a unique 4-digit ticket number
function generateTicketNumber() {
    return Math.floor(1000 + Math.random() * 9000);
}

function updateLotteryUI() {
    const numTickets = MOCK_USER.lotteryTickets.length;
    LOTTERY_STATUS.innerHTML = `<p class="mb-1">You have **${numTickets}** tickets.</p>`;
    // Enable draw button if tickets exist
    DRAW_BTN.disabled = numTickets === 0;
}

function buyLotteryTicket() {
    const savingsAccount = MOCK_USER.accounts.find(acc => acc.type === 'Global One Savings');

    if (savingsAccount.balance < TICKET_COST) {
        alert("Transaction failed: Insufficient funds for a R500.00 ticket.");
        return;
    }

    // 1. Debit the account
    savingsAccount.balance -= TICKET_COST;
    savingsAccount.transactions.push({ 
        id: Date.now(), 
        date: new Date().toISOString().split('T')[0], 
        description: 'Mock Lottery Ticket', 
        amount: -TICKET_COST, 
        type: 'debit' 
    });

    // 2. Issue a ticket
    const ticketNumber = generateTicketNumber();
    MOCK_USER.lotteryTickets.push(ticketNumber);

    // 3. Update UI
    displayAccounts(); // Refresh balances
    updateLotteryUI();
    alert(`Success! Ticket **#${ticketNumber}** purchased for R${TICKET_COST.toFixed(2)}. Good luck!`);
}

function runLotteryDraw() {
    // 1. Generate a single winning number (1 to MAX_NUMBER)
    const WINNING_NUMBER = Math.floor(Math.random() * MAX_NUMBER) + 1;
    
    // 2. Select a random user ticket as the 'winning' one for the mock
    const winningTicket = MOCK_USER.lotteryTickets[Math.floor(Math.random() * MOCK_USER.lotteryTickets.length)];
    const WINNING_PRIZE = 10000.00; // Mock prize

    let resultHTML = `<h4>🎉 Draw Results 🎉</h4>`;
    resultHTML += `<p class="fw-bold">The winning number is: <span class="text-danger fs-3">${WINNING_NUMBER}</span></p>`;

    // Check if the user's winning ticket matches the winning number
    // In a real system, the ticket would have a number/set of numbers.
    // For this mock, we'll simplify and say the winning ticket number must match the generated winning number.
    
    // To make it fun, let's make the winning condition simpler: a user's ticket number contains the WINNING_NUMBER as a substring.
    const isWinner = MOCK_USER.lotteryTickets.some(ticket => String(ticket).includes(String(WINNING_NUMBER).slice(-1))); // Match last digit

    if (isWinner) {
        const savingsAccount = MOCK_USER.accounts.find(acc => acc.type === 'Global One Savings');
        savingsAccount.balance += WINNING_PRIZE;
        savingsAccount.transactions.push({ 
            id: Date.now(), 
            date: new Date().toISOString().split('T')[0], 
            description: 'Lottery Winnings', 
            amount: WINNING_PRIZE, 
            type: 'credit' 
        });

        resultHTML += `<div class="alert alert-success mt-3">**CONGRATULATIONS!** You won **R${WINNING_PRIZE.toFixed(2)}**! Check your balance.</div>`;
    } else {
        resultHTML += `<div class="alert alert-warning mt-3">Sorry, you didn't win this time. Keep saving and playing!</div>`;
    }

    // Reset for next draw cycle
    MOCK_USER.lotteryTickets = []; 
    displayAccounts();
    updateLotteryUI();
    LOTTERY_STATUS.innerHTML = resultHTML;
    alert("Lottery Draw Complete!");
}

// --- Event Listeners for Lottery ---
BUY_TICKET_BTN.addEventListener('click', buyLotteryTicket);
DRAW_BTN.addEventListener('click', runLotteryDraw);

