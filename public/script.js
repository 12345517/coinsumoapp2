// script.js

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idNumber = document.getElementById('idNumber').value;
            const name = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const pais = document.getElementById('pais').value;
            const departamento = document.getElementById('departamento').value;
            const ciudad = document.getElementById('ciudad').value;
            const direccion = document.getElementById('direccion').value;
            const role = document.getElementById('role').value;
            const sponsorId = document.getElementById('sponsorId').value;

            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idNumber, name, username, email, password, whatsapp, pais, departamento, ciudad, direccion, role, sponsorId })
            });

            if (response.ok) {
                alert('User registered successfully');
                window.location.href = '/login'; // Redirigir a la página de inicio de sesión
            } else {
                const errorText = await response.text();
                alert('Error registering user: ' + errorText);
            }
        });
    } else {
        console.error("El formulario con el ID 'registerForm' no se encontró.");
    }
});