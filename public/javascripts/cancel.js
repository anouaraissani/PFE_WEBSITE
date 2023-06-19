document.addEventListener('DOMContentLoaded', function() {
    const cancelButton = document.querySelector('.cancel-button');
    cancelButton.addEventListener('click', function(event) {
      event.preventDefault();
      window.location.href = "/usersmanagement";
    });
  });