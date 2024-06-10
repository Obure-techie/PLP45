document.getElementById('customer-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const sname = document.getElementById('sname').value;
    const phone = document.getElementById('phone').value;
    const meter = document.getElementById('meter').value;

    const customerData = {
        name: name,
        sname: sname,
        phone: phone,
        meter: meter
    };

    try {
        const response = await fetch('https://over-party.pockethost.io//api/collections/WATER_MANAGEMENT_PROJECT/records', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(customerData)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Customer added successfully!');
            document.getElementById('customer-form').reset();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add customer. Please try again.');
    }
});
