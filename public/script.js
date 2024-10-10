 // script.js

 document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);

        fetch('https://coinsumo.co/api/registro', { // Reemplaza con tu URL de API
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error en el registro');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Registro exitoso');
                // Aquí puedes redirigir a otra página o mostrar un mensaje de éxito
                window.location.href = '/exito'; // Ejemplo: redirige a /exito
            } else {
                alert('Error en el registro: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el registro: ' + error.message);
        });
    });
});