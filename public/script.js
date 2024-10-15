 // script.js

 document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const tipo_usuario = document.getElementById('tipo_usuario').value;
        const porcentaje = document.getElementById('porcentaje').value;
        const pais = document.getElementById('pais').value;
        const departamento = document.getElementById('departamento').value;
        const ciudad = document.getElementById('ciudad').value;
        const direccion = document.getElementById('direccion').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        const data = {
            userId,
            name,
            email,
            whatsapp,
            tipo_usuario,
            porcentaje,
            pais,
            departamento,
            ciudad,
            direccion,
            acceptTerms
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Registro exitoso');
                window.location.href = '/exito'; // Redirige a una página de éxito
            } else {
                alert(`Error en el registro: ${result.message}`);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Error al enviar el formulario');
        }
    });
});