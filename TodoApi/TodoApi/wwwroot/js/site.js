const uri = 'todoitems';
let todos = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    const addNameTextbox = document.getElementById('add-name').value.trim();
    const categoryTextbox = document.getElementById('add-category').value.trim();
    const isRecurringCheckbox = document.getElementById('add-reccuring').checked;
    const reccuringFrequencyInDaysTextbox = parseInt(document.getElementById('add-reccuring-days').value.trim(), 10);
    const priorityTextbox = parseInt(document.getElementById('add-priority').value.trim(), 10);
    const dueDateTextbox = document.getElementById('add-due-date').value;

    const dueDateConverted = new Date(dueDateTextbox);

    const item = {
        IsCompleted: false,
        name: addNameTextbox,
        dateDeadline: dueDateConverted,
        isReccuring: isRecurringCheckbox,
        reccuringFrequencyInDays: reccuringFrequencyInDaysTextbox || 0,
        category: categoryTextbox,
        priority: priorityTextbox || 0
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    const confirmation = confirm(`Would you like to delete item #${id}? The action is irreversible.`);
    if (!confirmation)
        return;

    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function activateDarkMode() {
    document.body.style.filter = "invert(100%)";
    document.body.style.backgroundColor = "black";
}

function displayEditForm(id) {
    const item = todos.find(item => item.id === id);

    document.getElementById('editFormHeading').style.display = "block"
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isCompleted;
    document.getElementById('editForm').style.display = 'flex';
    document.getElementById('edit-category').value = item.category;
    document.getElementById('edit-reccuring').value = item.isReccuring;
    document.getElementById('edit-reccuring-days').value = item.reccuringFrequencyInDays;
    document.getElementById('edit-priority').value = item.priority;
    document.getElementById('edit-due-date').value = item.dateDeadline;

}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const categoryTextbox = document.getElementById('edit-category').value.trim();
    const isRecurringCheckbox = document.getElementById('edit-reccuring').checked;
    const reccuringFrequencyInDaysTextbox = parseInt(document.getElementById('edit-reccuring-days').value.trim(), 10);
    const priorityTextbox = parseInt(document.getElementById('edit-priority').value.trim(), 10);
    const dueDateTextbox = document.getElementById('edit-due-date').value;

    const dueDateConverted = new Date(dueDateTextbox);

    const item = {
        id: parseInt(itemId, 10),
        IsCompleted: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim(),
        dateDeadline: dueDateConverted,
        isReccuring: isRecurringCheckbox,
        reccuringFrequencyInDays: reccuringFrequencyInDaysTextbox || 0,
        category: categoryTextbox,
        priority: priorityTextbox || 0
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function searchTodo() {
    const query = document.getElementById('filter-input').value;

    fetch(`${uri}/query=${query}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to update item.', error));
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('editFormHeading').style.display = "none";
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'to-do' : 'to-dos';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('todos');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let isCompleteCheckbox = document.createElement('input');
        isCompleteCheckbox.type = 'checkbox';
        isCompleteCheckbox.disabled = true;
        isCompleteCheckbox.checked = item.isCompleted;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(isCompleteCheckbox);

        let td2 = tr.insertCell(1);
        let textNode = document.createTextNode(item.name);
        td2.appendChild(textNode);

        let td3 = tr.insertCell(2);
        textNode = document.createTextNode(item.dateDeadline);
        if (new Date(item.dateDeadline) < Date.now()) {
            tr.style.backgroundColor = "red";
            tr.style.color = "white";
        }
        td3.appendChild(textNode);

        let td4 = tr.insertCell(3);
        textNode = document.createTextNode(item.category);
        td4.appendChild(textNode);

        let td5 = tr.insertCell(4);
        textNode = document.createTextNode(item.priority);
        td5.appendChild(textNode);

        let td6 = tr.insertCell(5);
        textNode = document.createTextNode(`${item.isReccuring ? `Every ${item.reccuringFrequencyInDays} days` : ""}`);
        td6.appendChild(textNode);

        let td7 = tr.insertCell(6);
        td7.appendChild(editButton);

        let td8 = tr.insertCell(7);
        td8.appendChild(deleteButton);
    });

    todos = data;
}

document.getElementById("edit-due-date").setAttribute("min", new Date().toISOString().split("T")[0]);
