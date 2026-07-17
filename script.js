const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');
const links = document.querySelectorAll('.navbar a');
const typingText = document.querySelector('.typing');
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

const words = ['Web Developer', 'UI/UX Designer', 'IoT Enthusiast'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
    if (!typingText) return;

    const currentWord = words[wordIndex];
    typingText.textContent = currentWord.substring(0, charIndex);

    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeLoop, 120);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeLoop, 80);
    } else {
        isDeleting = !isDeleting;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, 800);
    }
}

if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuToggle.classList.toggle('fa-times');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuToggle.classList.remove('fa-times');
        });
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        const formData = new FormData(contactForm);

        button.textContent = 'Sending...';
        button.disabled = true;

        try {
            const response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (formMessage) {
                formMessage.textContent = result.message || 'Message sent.';
                formMessage.classList.add('show');
            }

            if (response.ok && result.success) {
                contactForm.reset();
            }
        } catch (error) {
            if (formMessage) {
                formMessage.textContent = 'Something went wrong. Please try again later.';
                formMessage.classList.add('show');
            }
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    });
}

typeLoop();
