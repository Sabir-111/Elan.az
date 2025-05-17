document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('announcementForm');
    const list = document.getElementById('announcementList');
    const search = document.getElementById('search');
    const toggle = document.getElementById('darkModeToggle');

    const saveToStorage = () => {
        localStorage.setItem('announcements', list.innerHTML);
    };

    const loadFromStorage = () => {
        const data = localStorage.getItem('announcements');
        if (data) list.innerHTML = data;
    };

    const addAnnouncement = (title, content) => {
        const div = document.createElement('div');
        div.classList.add('announcement');
        const now = new Date().toLocaleString();

        div.innerHTML = `
            <h3>${title}</h3>
            <p>${content}</p>
            <small>${now}</small>
            <button class="delete">Sil</button>
        `;
        list.appendChild(div);
        saveToStorage();
    };

    form.addEventListener('submit', e => {
        e.preventDefault();
        const title = form.title.value.trim();
        const content = form.content.value.trim();
        if (title && content) {
            addAnnouncement(title, content);
            form.reset();
        }
    });

    list.addEventListener('click', e => {
        if (e.target.classList.contains('delete')) {
            e.target.parentElement.remove();
            saveToStorage();
        }
    });

    search.addEventListener('input', () => {
        const val = search.value.toLowerCase();
        document.querySelectorAll('.announcement').forEach(item => {
            const match = item.querySelector('h3').textContent.toLowerCase().includes(val);
            item.style.display = match ? 'block' : 'none';
        });
    });

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    loadFromStorage();
});
