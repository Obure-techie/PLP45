document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.querySelector('#customer-table tbody');
    const tableHeadRow = document.querySelector('#customer-table thead tr');

    function getMonthNames() {
        const now = new Date();
        const monthNames = [];
        for (let i = 2; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            monthNames.push(date.toLocaleString('default', { month: 'long' }));
        }
        return monthNames;
    }

    function addMonthHeaders() {
        const monthNames = getMonthNames();
        monthNames.forEach(month => {
            const th = document.createElement('th');
            th.textContent = month + ' Usage (Liters)';
            tableHeadRow.appendChild(th);
        });

        const actionsTh = document.createElement('th');
        actionsTh.textContent = 'Actions';
        tableHeadRow.appendChild(actionsTh);
    }

    async function fetchCustomers() {
        try {
            const response = await fetch('https://over-party.pockethost.io//api/collections/WATER_MANAGEMENT_PROJECT/records/');
            if (response.ok) {
                const data = await response.json();
                tableBody.innerHTML = ''; // Clear existing rows
                const monthNames = getMonthNames();

                data.items.forEach(customer => {
                    const row = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = customer.name;
                    row.appendChild(nameCell);

                    const snameCell = document.createElement('td');
                    snameCell.textContent = customer.sname;
                    row.appendChild(snameCell);

                    const phoneCell = document.createElement('td');
                    phoneCell.textContent = customer.phone;
                    row.appendChild(phoneCell);

                    const meterCell = document.createElement('td');
                    meterCell.textContent = customer.meter;
                    row.appendChild(meterCell);

                    monthNames.forEach(month => {
                        const monthCell = document.createElement('td');
                        const input = document.createElement('input');
                        input.type = 'number';
                        input.value = customer.usage[month.toLowerCase()] || '';
                        input.addEventListener('change', (event) => updateUsage(customer.id, month.toLowerCase(), event.target.value));
                        monthCell.appendChild(input);
                        row.appendChild(monthCell);
                    });

                    const actionsCell = document.createElement('td');
                    const updateButton = document.createElement('button');
                    updateButton.textContent = 'Update';
                    updateButton.addEventListener('click', () => updateCustomer(customer.id));
                    actionsCell.appendChild(updateButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteCustomer(customer.id));
                    actionsCell.appendChild(deleteButton);

                    row.appendChild(actionsCell);
                    tableBody.appendChild(row);
                });
            } else {
                const error = await response.json();
                console.error('Error:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function updateCustomer(id) {
        const name = prompt("Enter new name:");
        const sname = prompt("Enter new second name:");
        const phone = prompt("Enter new phone:");
        const meter = prompt("Enter new meter number:");
        const monthNames = getMonthNames();
        const usage = {};

        monthNames.forEach(month => {
            const usageValue = prompt(`Enter new ${month} usage:`);
            if (usageValue) {
                usage[month.toLowerCase()] = usageValue;
            }
        });

        if (name && sname && phone && meter) {
            try {
                const response = await fetch(`https://over-party.pockethost.io//api/collections/WATER_MANAGEMENT_PROJECT/records/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, sname, phone, meter, usage })
                });
                if (response.ok) {
                    fetchCustomers(); 
                } else {
                    const error = await response.json();
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('All fields are required for update!');
        }
    }

    async function updateUsage(id, month, value) {
        try {
            const response = await fetch(`https://over-party.pockethost.io//api/collections/WATER_MANAGEMENT_PROJECT/records/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usage: { [month]: value } })
            });
            if (!response.ok) {
                const error = await response.json();
                console.error('Error:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async function deleteCustomer(id) {
        if (confirm("Are you sure you want to delete this customer?")) {
            try {
                const response = await fetch(`https://over-party.pockethost.io//api/collections/WATER_MANAGEMENT_PROJECT/records/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchCustomers(); 
                } else {
                    const error = await response.json();
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // Add month headers and fetch customers
    addMonthHeaders();
    fetchCustomers();
    setInterval(fetchCustomers, 1500);
});
