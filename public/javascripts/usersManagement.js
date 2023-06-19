// Fetch user data from the API and populate the table
fetch('/usersmanagement/api/users')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector('tbody')

    data.forEach(user => {
        const row = document.createElement('tr')

        const idCell = document.createElement('td')
        idCell.textContent = user[0]
        row.appendChild(idCell)

        const emailCell = document.createElement('td')
        emailCell.textContent = user[1]
        row.appendChild(emailCell)

        const nameCell = document.createElement('td')
        nameCell.textContent = user[2]
        row.appendChild(nameCell)

        const roleCell = document.createElement('td')
        roleCell.textContent = user[3]
        row.appendChild(roleCell)

        const actionCell = document.createElement('td')
        const editIcon = document.createElement('ion-icon')
        editIcon.setAttribute('name', "create-outline")
        editIcon.classList.add('edit-icon')
        
        // when click on edit icon it shows a new page
        editIcon.addEventListener('click', function() {
            window.location.href = `/usersmanagement/edit/${user[0]}`
        })

        actionCell.appendChild(editIcon)

        const deleteIcon = document.createElement('ion-icon')
        deleteIcon.setAttribute('name', "trash-outline")
        deleteIcon.classList.add('delete-icon')

        // when click on delete icon it delete the user
        deleteIcon.addEventListener('click', function() {
            const confirmed = confirm("Êtes-vous sûr(e) de vouloir supprimer cet utilisateur ?")
        
            if (confirmed) {
                // User confirmed deletion, redirect to delete route
                window.location.href = `/usersmanagement/delete/${user[0]}`
            } else {
                // User cancelled deletion
                // Add any additional logic here if needed
            }
        })

        actionCell.appendChild(deleteIcon)

        row.appendChild(actionCell)

        tableBody.appendChild(row)
    })
})

// NOMBRE DES UTILISATEURS
// Fetch the user count from the API and update the user count element
fetch('/usersmanagement/api/usercount')
    .then(response => response.json())
    .then(data => {
        const userCountElement = document.getElementById('user-count')
        userCountElement.textContent = `Nombre d'utilisateurs: ${data.count}`
    }); 
// Get a reference to the add users button
const addButton = document.querySelector('.add-button')
// Add a click event listener to the button
addButton.addEventListener('click', function() {
  // Redirect to the desired page when the button is clicked
//   window.location.href = 'http://localhost:5000/usersmanagement/register'
  window.location.href = '/usersmanagement/register'
})