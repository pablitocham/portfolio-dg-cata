AOS.init({
    once: false,
    offset: 60,
    duration: 700,
    easing: "ease-out-quad",
    mirror: true
})

function resetAosOnScroll() {
    document.querySelectorAll('[data-aos]').forEach(el => {
        const rect = el.getBoundingClientRect()
        const outOfView = rect.bottom < 0 || rect.top > window.innerHeight
        if (outOfView) {
            el.classList.remove('aos-animate')
        }
    })
}
window.addEventListener('scroll', resetAosOnScroll, { passive: true })
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
        setTimeout(() => {
            resetAosOnScroll()
            AOS.refresh()
        }, 600)
    })
})


const yearEl = document.getElementById('year')
if (yearEl) yearEl.textContent = new Date().getFullYear()

const header = document.getElementById('header')
const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 30)
}
window.addEventListener('scroll', onScroll, { passive: true })

const toggleBtn = document.getElementById('toggleMenu')
const navLinks = document.getElementById('navLinks')
toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open')
    toggleBtn.setAttribute('aria-expanded', isOpen)
    toggleBtn.querySelector('i').className = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars'
})


navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open')
        toggleBtn.setAttribute('aria-expanded', 'false')
        toggleBtn.querySelector('i').className = 'fa-solid fa-bars'
    })
})

document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open')
        toggleBtn.setAttribute('aria-expanded', 'false')
        toggleBtn.querySelector('i').className = 'fa-solid fa-bars'
    }
})

const form = document.getElementById('contactForm')
const submitBtn = document.getElementById('submitBtn')
const successMsg = document.getElementById('form-success')
const validators = {
    nombre: v => v.trim().length >= 2 ? '' : 'El nombre debe tener al menos 2 caracteres.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Ingresá un email válido.',
    mensaje: v => v.trim().length >= 10 ? '' : 'El mensaje debe tener al menos 10 caracteres.',
}

const showError = (fieldId, message) => {
    const input = document.getElementById(fieldId)
    const error = document.getElementById(`${fieldId}-error`)
    if (!input || !error) return
    input.classList.toggle('error', !!message)
    error.textContent = message
}

const validateField = (fieldId) => {
    const input = document.getElementById(fieldId)
    if (!input || !validators[fieldId]) return true
    const msg = validators[fieldId](input.value)
    showError(fieldId, msg)
    return !msg
}

['nombre', 'email', 'mensaje'].forEach(id => {
    const input = document.getElementById(id)
    if (input) {
        input.addEventListener('blur', () => validateField(id))
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) validateField(id)
        })
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const fields = ['nombre', 'email', 'mensaje']
    const isValid = fields.map(validateField).every(Boolean)

    if (!isValid) return
    submitBtn.disabled = true
    submitBtn.textContent = 'Enviando…'

    await new Promise(r => setTimeout(r, 1400))

    submitBtn.disabled = false
    submitBtn.innerHTML = 'Enviar Mensaje <i class="fa-solid fa-paper-plane" aria-hidden="true"></i>'
    form.reset()
    successMsg.hidden = false

    setTimeout(() => {
        successMsg.hidden = true
    }, 6000)
})