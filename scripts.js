document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // In-page navigation (show/hide sections)
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const sections = document.querySelectorAll('.section');

    function showSection(id) {
        sections.forEach(s => {
            if (s.id === id) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        // optional: move focus to the newly shown section for accessibility
        const el = document.getElementById(id);
        if (el) el.focus({preventScroll:true});
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            if (!target) return;
            // update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            // show section
            showSection(target);
        });
    });

    // Allow deep-linking via hash on load
    if (location.hash) {
        const id = location.hash.replace('#','');
        const targetLink = document.querySelector(`.nav-link[data-target="${id}"]`);
        if (targetLink) targetLink.click();
    }

    // Contact form submission via Formspree (optional AJAX)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const feedback = contactForm.querySelector('.form-feedback');
            const submitBtn = contactForm.querySelector('.submit-btn');
            const action = contactForm.getAttribute('action');
            if (!action) {
                feedback.textContent = 'Form chưa cấu hình action Formspree.';
                return;
            }
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang gửi...';
            const formData = new FormData(contactForm);
            try {
                const res = await fetch(action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (res.ok) {
                    feedback.textContent = 'Gửi thành công — cảm ơn bạn!';
                    contactForm.reset();
                } else {
                    const data = await res.json().catch(() => ({}));
                    feedback.textContent = data.error || 'Có lỗi khi gửi, thử lại sau.';
                }
            } catch (err) {
                feedback.textContent = 'Lỗi mạng — kiểm tra kết nối.';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Gửi';
            }
        });
    }
});
