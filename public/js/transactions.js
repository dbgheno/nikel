const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");

let data = {
    transactions: []
};

document.getElementById("button-logout").addEventListener("click", logout);

// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    data.transactions.unshift({
        id: Date.now(),
        value: value,
        type: type,
        description: description,
        date: date
    });

    saveData(data);
    e.target.reset();
    myModal.hide();

    getTransactions();

    alert("Lançamento adicionado com sucesso!");

});

checkLogged();

function checkLogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");

    window.location.href = "index.html";
}

function getTransactions() {
    const transactions = data.transactions;
    let transactionsHtml = "";

    if (transactions.length) {
        transactions.forEach((item) => {
            let type = "Entrada";
            if (item.type === "2") {
                type = "Saída";
            }

            transactionsHtml += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <td>${item.value.toFixed(2)}</td>
                    <td>${type}</td>
                    <td>${item.description}</td>
                    <td><button class="btn btn-danger btn-sm" onclick="confirmRemoveTransaction(${item.id}, '${type}')">Remover</button></td>
                </tr>
            `;
        });
    }

    document.getElementById("transactions-list").innerHTML = transactionsHtml;
}

function confirmRemoveTransaction(id, type) {
    const typeText = type === "Saída" ? "saída" : "entrada";
    const confirmMessage = `Confirmar a exclusão dessa ${typeText}?`;
    const isConfirmed = window.confirm(confirmMessage);

    if (isConfirmed) {
        removeTransaction(id);
    }
}

function removeTransaction(id) {
    const index = data.transactions.findIndex((item) => item.id === id);
    if (index !== -1) {
        data.transactions.splice(index, 1);
        saveData(data);
        getTransactions();
    }
}

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}
