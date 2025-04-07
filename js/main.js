document.addEventListener('DOMContentLoaded', function() {
    // Replace with your actual AWS Lambda URL
    const API_URL = 'https://543ntm9vmd.execute-api.us-west-2.amazonaws.com';
    const tableBody = document.getElementById('table-body');
    const form = document.getElementById('item-form');

    // Function to load items from the backend and update the table
    function loadItems() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                tableBody.innerHTML = '';
                // Assuming the backend returns an array of items
                data.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                        <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
                    `;
                    tableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error fetching items:', error));
    }

    // Event listener for the Add Item form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('item-id').value;
        const name = document.getElementById('item-name').value;
        const price = document.getElementById('item-price').value;
        const newItem = { id, name, price };

        // Sending PUT request to add a new item
        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
        })
        .then(response => {
            console.log('PUT response:', response);
            if (!response.ok) {
                throw new Error('Failed to add item');
            }
            // Optionally log the response data if your API returns anything useful
            return response.json();
        })
        .then(data => {
            console.log('Item added:', data);
            // Delay refresh slightly to account for eventual consistency on backend
            setTimeout(loadItems, 500);
            form.reset();
        })
        .catch(error => console.error('Error adding item:', error));
    });

    // Event delegation for Delete button clicks
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            // Sending DELETE request to remove the item.
            // Here we assume your API expects the id as a query parameter.
            fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                console.log('DELETE response:', response);
                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }
                return response.json();
            })
            .then(data => {
                console.log('Item deleted:', data);
                // Delay refresh if needed
                setTimeout(loadItems, 500);
            })
            .catch(error => console.error('Error deleting item:', error));
        }
    });

    // Initial load of items when the page is ready
    loadItems();
});
