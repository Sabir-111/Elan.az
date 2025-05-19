
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeUser = document.getElementById('welcomeUser');
  const userPanel = document.getElementById('userPanel');
  const announcementForm = document.getElementById('announcementForm');
  const adminPanel = document.getElementById('adminPanel');
  const adminList = document.getElementById('adminAnnouncementList');
  const mainList = document.getElementById('announcementList');

  let users = JSON.parse(localStorage.getItem('users')) || {};
  let currentUser = localStorage.getItem('currentUser') || null;
  let announcements = JSON.parse(localStorage.getItem('allAnnouncements')) || [];

  function saveAnnouncements() {
    localStorage.setItem('allAnnouncements', JSON.stringify(announcements));
  }

  function renderAnnouncements() {
    mainList.innerHTML = '';
    adminList.innerHTML = '';

    announcements.forEach(item => {
      const div = document.createElement('div');
      div.className = 'announcement';
      div.setAttribute('data-id', item.id);
      div.innerHTML = `
        ${item.image ? `<img src="${item.image}" alt="Şəkil">` : ''}
        <div class="announcement-content">
          <h3>${item.title}</h3>
          <p class="price">${item.price} AZN</p>
          <p>${item.content}</p>
          <small>${item.date} | ${item.category}</small><br><br>
          ${item.status === 'pending' && currentUser === 'admin' ? `
            <button class="approve">✅ Təsdiqlə</button>
            <button class="remove">❌ Sil</button>` : ''}
        </div>
      `;

      if (item.status === 'approved') mainList.appendChild(div);
      else if (item.status === 'pending' && currentUser === 'admin') adminList.appendChild(div);
    });
  }

  function updateUI() {
    if (currentUser) {
      welcomeUser.textContent = `Xoş gəlmisiniz, ${currentUser}`;
      userPanel.style.display = 'block';
      registerForm.style.display = 'none';
      loginForm.style.display = 'none';
      announcementForm.style.display = currentUser !== 'admin' ? 'block' : 'none';
      adminPanel.style.display = currentUser === 'admin' ? 'block' : 'none';
    } else {
      userPanel.style.display = 'none';
      registerForm.style.display = 'block';
      loginForm.style.display = 'block';
      announcementForm.style.display = 'none';
      adminPanel.style.display = 'none';
    }
    renderAnnouncements();
  }

  updateUI();

  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('regUsername').value.trim();
    const p = document.getElementById('regPassword').value;
    if (users[u]) alert('İstifadəçi mövcuddur');
    else {
      users[u] = p;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Qeydiyyat tamamlandı!');
    }
  });

  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value;
    if (users[u] && users[u] === p || u === 'admin' && p === 'admin') {
      currentUser = u;
      localStorage.setItem('currentUser', currentUser);
      updateUI();
    } else alert('Yanlış giriş!');
  });

  logoutBtn.onclick = () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
  };

  announcementForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const file = document.getElementById('image').files[0];
    const reader = new FileReader();
    const id = 'ELN' + Date.now();
    const date = new Date().toLocaleString();

    reader.onload = () => {
      const image = file ? reader.result : '';
      announcements.unshift({ id, title, content, category, price, image, date, status: 'pending' });
      saveAnnouncements();
      updateUI();
      announcementForm.reset();
    };

    if (file) reader.readAsDataURL(file);
    else reader.onload();
  });

  adminList.addEventListener('click', e => {
    const card = e.target.closest('.announcement');
    const id = card.dataset.id;
    const index = announcements.findIndex(a => a.id === id);

    if (e.target.classList.contains('approve')) {
      announcements[index].status = 'approved';
    } else if (e.target.classList.contains('remove')) {
      announcements.splice(index, 1);
    }
    saveAnnouncements();
    updateUI();
  });
});
