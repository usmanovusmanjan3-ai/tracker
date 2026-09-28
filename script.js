// ============================================
// VELORA — SHAXSIY MOLIYA HISOBLAGICHI
// ============================================

let transactions =
    JSON.parse(
        localStorage.getItem("velora_transactions")
    ) || [];


// ELEMENTLAR

const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const form =
    document.getElementById("transactionForm");

const titleInput =
    document.getElementById("title");

const amountInput =
    document.getElementById("amount");

const dateInput =
    document.getElementById("date");

const categoryInput =
    document.getElementById("category");

const noteInput =
    document.getElementById("note");


// BUGUNGI SANA

const today =
    new Date()
        .toISOString()
        .split("T")[0];

dateInput.value = today;


// ============================================
// MODAL
// ============================================

openModal.addEventListener("click", () => {

    modal.classList.add("show");

});


closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});


modal.addEventListener("click", (event) => {

    if (event.target === modal) {

        modal.classList.remove("show");

    }

});


// ============================================
// TRANZAKSIYA QO‘SHISH
// ============================================

form.addEventListener("submit", (event) => {

    event.preventDefault();


    const type =
        document.querySelector(
            'input[name="type"]:checked'
        ).value;


    const transaction = {

        id: Date.now(),

        title:
            titleInput.value.trim(),

        amount:
            Number(amountInput.value),

        date:
            dateInput.value,

        category:
            categoryInput.value,

        note:
            noteInput.value.trim(),

        type:
            type

    };


    transactions.unshift(transaction);


    saveData();


    form.reset();


    dateInput.value = today;


    modal.classList.remove("show");


    updateUI();

});


// ============================================
// SAQLASH
// ============================================

function saveData() {

    localStorage.setItem(
        "velora_transactions",
        JSON.stringify(transactions)
    );

}


// ============================================
// PULNI FORMATLASH
// ============================================

function formatMoney(number) {

    return new Intl.NumberFormat("uz-UZ")
        .format(number) + " so‘m";

}


// ============================================
// HISOB-KITOB
// ============================================

function getIncome() {

    return transactions

        .filter(item => item.type === "income")

        .reduce(
            (total, item) =>
                total + item.amount,
            0
        );

}


function getExpense() {

    return transactions

        .filter(item => item.type === "expense")

        .reduce(
            (total, item) =>
                total + item.amount,
            0
        );

}


function getBalance() {

    return getIncome() - getExpense();

}


// ============================================
// BOSH SAHIFA
// ============================================

function updateDashboard() {

    const income = getIncome();

    const expense = getExpense();

    const balance = income - expense;


    document.getElementById("income")
        .textContent =
        formatMoney(income);


    document.getElementById("expense")
        .textContent =
        formatMoney(expense);


    document.getElementById("balance")
        .textContent =
        formatMoney(balance);


    document.getElementById("transactionCount")
        .textContent =
        transactions.length;

}


// ============================================
// SO‘NGGI TRANZAKSIYALAR
// ============================================

function renderRecentTransactions() {

    const container =
        document.getElementById(
            "recentTransactions"
        );


    const recent =
        transactions.slice(0, 6);


    if (recent.length === 0) {

        container.innerHTML = `
            <div class="empty">
                Hozircha tranzaksiyalar mavjud emas.
            </div>
        `;

        return;

    }


    container.innerHTML =
        recent.map(item => {

            const sign =
                item.type === "income"
                    ? "+"
                    : "-";


            const icon =
                item.type === "income"
                    ? "↑"
                    : "↓";


            return `

                <div class="transaction">

                    <div class="transaction-icon">
                        ${icon}
                    </div>

                    <div class="transaction-info">

                        <strong>
                            ${escapeHTML(item.title)}
                        </strong>

                        <small>
                            ${escapeHTML(item.category)}
                            •
                            ${item.date}
                        </small>

                    </div>

                    <div
                        class="transaction-amount ${item.type}"
                    >
                        ${sign}${formatMoney(item.amount)}
                    </div>

                </div>

            `;

        }).join("");

}


// ============================================
// TRANZAKSIYALAR JADVALI
// ============================================

function renderTable() {

    const table =
        document.getElementById(
            "transactionTable"
        );


    const search =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase();


    const filter =
        document.getElementById(
            "filterType"
        ).value;


    const filtered =
        transactions.filter(item => {

            const matchesSearch =

                item.title
                    .toLowerCase()
                    .includes(search)

                ||

                item.category
                    .toLowerCase()
                    .includes(search);


            const matchesType =

                filter === "all"

                ||

                item.type === filter;


            return (
                matchesSearch &&
                matchesType
            );

        });


    if (filtered.length === 0) {

        table.innerHTML = `

            <tr>

                <td colspan="6">

                    <div class="empty">
                        Tranzaksiya topilmadi.
                    </div>

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        filtered.map(item => {

            const sign =
                item.type === "income"
                    ? "+"
                    : "-";


            const typeText =
                item.type === "income"
                    ? "Daromad"
                    : "Xarajat";


            return `

                <tr>

                    <td>
                        <strong>
                            ${escapeHTML(item.title)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHTML(item.category)}
                    </td>

                    <td>
                        ${item.date}
                    </td>

                    <td>

                        <span
                            class="type-badge ${item.type}"
                        >
                            ${typeText}
                        </span>

                    </td>

                    <td>

                        <strong
                            class="${item.type}"
                        >
                            ${sign}${formatMoney(item.amount)}
                        </strong>

                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${item.id})"
                            title="O‘chirish"
                        >
                            ×
                        </button>

                    </td>

                </tr>

            `;

        }).join("");

}


// ============================================
// O‘CHIRISH
// ============================================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Ushbu tranzaksiyani o‘chirmoqchimisiz?"
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    saveData();

    updateUI();

}


// ============================================
// KATEGORIYALAR
// ============================================

function renderCategorySummary() {

    const container =
        document.getElementById(
            "categorySummary"
        );


    const expenses =
        transactions.filter(
            item =>
                item.type === "expense"
        );


    if (expenses.length === 0) {

        container.innerHTML = `

            <div class="empty">
                Hozircha xarajatlar mavjud emas.
            </div>

        `;

        return;

    }


    const categories = {};


    expenses.forEach(item => {

        if (!categories[item.category]) {

            categories[item.category] = 0;

        }


        categories[item.category] +=
            item.amount;

    });


    const icons = {

        "Oziq-ovqat": "🍔",

        "Uy-joy": "🏠",

        "Transport": "🚕",

        "Ish": "💻",

        "Xaridlar": "🛍️",

        "Ta’lim": "🎓",

        "Ko‘ngilochar": "🎮",

        "Boshqa": "📦"

    };


    container.innerHTML =

        Object.entries(categories)

            .sort(
                (a, b) =>
                    b[1] - a[1]
            )

            .map(
                ([category, amount]) => {

                    return `

                        <div
                            class="category-card"
                        >

                            <span>
                                ${icons[category] || "📦"}
                            </span>

                            <strong>
                                ${escapeHTML(category)}
                            </strong>

                            <small>
                                ${formatMoney(amount)}
                            </small>

                        </div>

                    `;

                }
            )
            .join("");

}


// ============================================
// TAHLIL
// ============================================

function updateAnalytics() {

    const income = getIncome();

    const expense = getExpense();

    const balance =
        income - expense;


    document.getElementById(
        "analyticsIncome"
    ).textContent =
        formatMoney(income);


    document.getElementById(
        "analyticsExpense"
    ).textContent =
        formatMoney(expense);


    document.getElementById(
        "analyticsBalance"
    ).textContent =
        formatMoney(balance);


    document.getElementById(
        "analyticsTransactions"
    ).textContent =
        transactions.length;


    const max =
        Math.max(
            income,
            expense,
            1
        );


    const incomeHeight =
        (income / max) * 240;


    const expenseHeight =
        (expense / max) * 240;


    document.getElementById(
        "incomeBar"
    ).style.height =
        Math.max(
            incomeHeight,
            5
        ) + "px";


    document.getElementById(
        "expenseBar"
    ).style.height =
        Math.max(
            expenseHeight,
            5
        ) + "px";

}


// ============================================
// NAVIGATSIYA
// ============================================

const navItems =
    document.querySelectorAll(
        ".nav-item"
    );


const sections =
    document.querySelectorAll(
        ".section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            switchSection(
                button.dataset.section
            );

        }
    );

});


document.querySelectorAll(
    "[data-section-link]"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            switchSection(
                button.dataset.sectionLink
            );

        }
    );

});


function switchSection(sectionId) {

    sections.forEach(section => {

        section.classList.remove(
            "active-section"
        );

    });


    navItems.forEach(button => {

        button.classList.remove(
            "active"
        );

    });


    const target =
        document.getElementById(
            sectionId
        );


    const nav =
        document.querySelector(
            `[data-section="${sectionId}"]`
        );


    if (target) {

        target.classList.add(
            "active-section"
        );

    }


    if (nav) {

        nav.classList.add(
            "active"
        );

    }


    const titles = {

        dashboard: "Bosh sahifa",

        transactions:
            "Tranzaksiyalar",

        analytics:
            "Moliya tahlili",

        categories:
            "Kategoriyalar"

    };


    pageTitle.textContent =
        titles[sectionId] ||
        "Bosh sahifa";


    if (
        sectionId ===
        "transactions"
    ) {

        renderTable();

    }

}


// ============================================
// QIDIRISH
// ============================================

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    renderTable
);


document.getElementById(
    "filterType"
).addEventListener(
    "change",
    renderTable
);


// ============================================
// TEZKOR QO‘SHISH
// ============================================

document.querySelectorAll(
    ".quick"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const type =
                button.dataset.type;


            document.querySelector(
                `input[value="${type}"]`
            ).checked = true;


            modal.classList.add(
                "show"
            );

        }
    );

});


// ============================================
// XAVFSIZ HTML
// ============================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================
// BARCHASINI YANGILASH
// ============================================

function updateUI() {

    updateDashboard();

    renderRecentTransactions();

    renderTable();

    renderCategorySummary();

    updateAnalytics();

}


// ============================================
// NAMUNAVIY MA’LUMOTLAR
// ============================================

function createDemoData() {

    if (transactions.length > 0) {
        return;
    }


    transactions = [

        {
            id: 1,
            title: "Oylik maosh",
            amount: 5000000,
            date: today,
            category: "Maosh",
            note: "Oylik ish haqi",
            type: "income"
        },

        {
            id: 2,
            title: "Uy ijarasi",
            amount: 1500000,
            date: today,
            category: "Uy-joy",
            note: "",
            type: "expense"
        },

        {
            id: 3,
            title: "Oziq-ovqat",
            amount: 450000,
            date: today,
            category: "Oziq-ovqat",
            note: "",
            type: "expense"
        },

        {
            id: 4,
            title: "Yo‘l xarajati",
            amount: 200000,
            date: today,
            category: "Transport",
            note: "",
            type: "expense"
        },

        {
            id: 5,
            title: "Qo‘shimcha ish",
            amount: 1200000,
            date: today,
            category: "Ish",
            note: "",
            type: "income"
        }

    ];


    saveData();

}


// ============================================
// DASTURNI ISHGA TUSHIRISH
// ============================================

createDemoData();

updateUI();