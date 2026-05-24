document.addEventListener('DOMContentLoaded', () => {

    const logoContainer = document.querySelector('.banks-logos');
    
    function startBankCarousel() {
        setInterval(() => {
            // Selecciona el primer contenedor de la lista
            const firstLogo = logoContainer.querySelector('.bank-logo-container');
            if (!firstLogo) return;

            // Calcula el desplazamiento dinámico: Altura del bloque + el gap de 15px
            const displacement = firstLogo.offsetHeight + 15;

            // 1. Desplaza todos los contenedores hacia arriba uniformemente
            const allLogos = logoContainer.querySelectorAll('.bank-logo-container');
            allLogos.forEach(logo => {
                logo.style.transform = `translateY(-${displacement}px)`;
            });

            // 2. Espera a que termine la animación visual (0.5s) para reorganizar el HTML
            setTimeout(() => {
                allLogos.forEach(logo => {
                    logo.style.transition = 'none'; // Apaga la animación un instante
                    logo.style.transform = 'translateY(0px)'; // Resetea la posición base
                });

                // Mueve el primer elemento que ya subió al final de la lista
                logoContainer.appendChild(firstLogo);

                // Reactiva la transición suave para la siguiente tanda
                setTimeout(() => {
                    const updatedLogos = logoContainer.querySelectorAll('.bank-logo-container');
                    updatedLogos.forEach(logo => {
                        logo.style.transition = 'transform 0.5s ease-in-out';
                    });
                }, 50);

            }, 500); // 500ms es el tiempo que dura el efecto en el CSS

        }, 1000); // Ejecuta el movimiento cada 1 segundo
    }

    // Arranca el carrusel automatizado
    startBankCarousel();

    const paymentForm = document.getElementById('paymentForm');
    const captchaCodeElement = document.getElementById('captchaCode');
    const captchaInput = document.getElementById('captchaInput');

    // Función para simular cambio/actualización de Captcha al fallar
    function generateMockCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        captchaCodeElement.textContent = result;
    }

    // Evento al enviar el formulario
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita la recarga de página por defecto

        const userCaptcha = captchaInput.value.trim().toUpperCase();
        const currentCaptcha = captchaCodeElement.textContent.trim().toUpperCase();

        // Validar Captcha
        if (userCaptcha !== currentCaptcha) {
            alert('El código de validación (Captcha) es incorrecto. Por favor, intente de nuevo.');
            generateMockCaptcha(); // Cambiar captcha si se equivoca
            captchaInput.value = '';
            captchaInput.focus();
            return;
        }

        // Si pasa la validación del Captcha, extraemos los datos de pago
        const docId = document.getElementById('docId').value;
        const project = document.getElementById('project').value;
        const apartment = document.getElementById('apartment').value;
        const concept = document.getElementById('concept').value;
        const amount = document.getElementById('amount').value;

        console.log('Procesando pago:', { docId, project, apartment, concept, amount });

        // Simulación de redirección a la pasarela de pagos ACH / PSE
        alert(`Redireccionando al sistema PSE...\n\nProyecto: ${project}\nApartamento: ${apartment}\nValor: $${amount}`);

        // Aquí iría el envío real al servidor o API externa:
        // paymentForm.submit();
    });

    // Pequeño extra interactivo: Hacer clic en el icono "⚙" muestra ayuda del campo
    const infoIcons = document.querySelectorAll('.info-icon, .btn-help');
    infoIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const message = icon.getAttribute('title');
            alert(message);
        });
    });

});