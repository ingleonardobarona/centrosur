document.addEventListener('DOMContentLoaded', () => {
    const docInput = document.getElementById('documentNumber');
    const submitBtn = document.getElementById('btnSubmit');
    const loginForm = document.getElementById('loginForm');

    // Escuchar el evento de escritura para habilitar/deshabilitar botón dinámicamente
    docInput.addEventListener('input', () => {
        // Limpiar espacios en blanco
        const value = docInput.value.trim();

        // Condición: Se habilita si tiene al menos 5 dígitos numéricos
        if (value.length >= 1 && /^[a-zA-Z0-9]+$/.test(value)) {
            submitBtn.removeAttribute('disabled');
            submitBtn.classList.add('active');
        } else {
            submitBtn.setAttribute('disabled', 'true');
            submitBtn.classList.remove('active');
        }
    });

    // Controlar el envío del formulario
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (submitBtn.classList.contains('active')) {
            const documentValue = docInput.value.trim();

            // Simulación de envío de datos de autenticación a Palomma
            console.log('Iniciando sesión con documento:', documentValue);

            // Efecto visual de carga en el botón
            submitBtn.textContent = 'VERIFICANDO...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert(`Conexión exitosa.\nDocumento validado: ${documentValue}\nRedireccionando a la pasarela segura...`);
                // Aquí procesarías el redireccionamiento real
                // window.location.href = "nueva_ruta_de_pago";
                submitBtn.textContent = 'INICIAR SESIÓN';
                submitBtn.style.opacity = '1';
            }, 1200);
        }
    });
});