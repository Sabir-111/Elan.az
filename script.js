document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const welcomeUser = document.getElementById('welcomeUser');
  const userPanel = document.getElementById('userPanel');
  const announcementForm = document.getElementById('announcementForm');
  const authSection = document.getElementById('authSection');

  const announcementList = document.getElementById('announcementList');
  const favoriteList = document.getElementById('favoriteList');
  const editForm = document.getElementById('editForm');
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal .close');

  const users = JSON.parse(localStorage.getItem('users')) || {};
  let currentUser = localStorage.getItem('currentUser') || null;

  function updateUI() {
    if (currentUser) {
      welcomeUser.textContent = `Xoş gəlmisiniz, ${currentUser}`;
      userPanel.style.display = 'block';
      registerForm.style.display = 'none';
      loginForm.style.display = 'none';
      announcementForm.style.display = 'block';
    } else {
      userPanel.style.display = 'none';
      registerForm.style.display = 'block';
      loginForm.style.display = 'block';
      announcementForm.style.display = 'none';
    }
  }

  updateUI();

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    if (users[username]) {
      alert('Bu istifadəçi artıq mövcuddur!');
    } else {
      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));
      alert('Qeydiyyat tamamlandı! İndi giriş edə bilərsiniz.');
      registerForm.reset();
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (users[username] && users[username] === password) {
      currentUser = username;
      localStorage.setItem('currentUser', currentUser);
      updateUI();
    } else {
      alert('İstifadəçi adı və ya şifrə yanlışdır!');
    }
  });

  logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
  });

  // Elan Yüklə
  const saved = localStorage.getItem('elanlar');
  if (saved) announcementList.innerHTML = saved;

  const savedFavs = localStorage.getItem('favoritler');
  if (savedFavs) favoriteList.innerHTML = savedFavs;

  // Elan əlavə et
  announcementForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value.trim();
    const file = document.getElementById('image').files[0];
    const id = 'ELN' + Date.now();
    const date = new Date().toLocaleString();
    const reader = new FileReader();

    reader.onload = function () {
      const imgSrc = file ? reader.result : '';
      const div = document.createElement('div');
      div.className = 'announcement';
      div.setAttribute('data-category', category);
      div.setAttribute('data-title', title.toLowerCase());
      div.setAttribute('data-id', id);

      div.innerHTML = `
        ${imgSrc ? `<img src="${imgSrc}" alt="Elan şəkli">` : ''}
        <div class="announcement-content">
          <h3>${title}</h3>
          <p class="price">${price} AZN</p>
          <p>${content}</p>
          <small>${date} | ID: ${id} | ${category}</small><br><br>
          <button class="edit">Redaktə</button>
          <button class="delete">Sil</button>
          <button class="favorite">⭐ Favorit</button>
        </div>
      `;

      announcementList.prepend(div);
      localStorage.setItem('elanlar', announcementList.innerHTML);
      announcementForm.reset();
    };

    if (file) reader.readAsDataURL(file);
    else reader.onload();
  });

  // Redaktə, sil, favorit
  announcementList.addEventListener('click', e => {
    const card = e.target.closest('.announcement');
    const id = card?.dataset.id;

    if (e.target.classList.contains('edit')) {
      modal.style.display = 'block';
      document.getElementById('editId').value = id;
      document.getElementById('editTitle').value = card.querySelector('h3').textContent;
      document.getElementById('editContent').value = card.querySelector('p:not(.price)').textContent;
      document.getElementById('editPrice').value = parseInt(card.querySelector('.price').textContent);
    }

    if (e.target.classList.contains('delete')) {
      card.remove();
      localStorage.setItem('elanlar', announcementList.innerHTML);
    }

    if (e.target.classList.contains('favorite')) {
      const fav = card.cloneNode(true);
      fav.querySelector('.favorite')?.remove();
      favoriteList.appendChild(fav);
      localStorage.setItem('favoritler', favoriteList.innerHTML);
    }
  });

  // Redaktəni yadda saxla
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;
    const price = document.getElementById('editPrice').value;
    const card = document.querySelector(`.announcement[data-id='${id}']`);

    if (card) {
      card.querySelector('h3').textContent = title;
      card.querySelector('.price').textContent = `${price} AZN`;
      card.querySelector('p:not(.price)').textContent = content;
      modal.style.display = 'none';
      localStorage.setItem('elanlar', announcementList.innerHTML);
    }
  });

  // Modal bağla
  modalClose.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if (e.target == modal) modal.style.display = 'none'; };

  // Filtrlər
  const filterCategory = document.getElementById('filterCategory');
  const searchInput = document.getElementById('searchInput');

  function applyFilters() {
    const selected = filterCategory.value;
    const search = searchInput.value.toLowerCase();

    document.querySelectorAll('.announcement').forEach(elan => {
      const matchCat = (selected === 'Hamısı' || elan.dataset.category === selected);
      const matchSearch = elan.dataset.title.includes(search);
      elan.style.display = (matchCat && matchSearch) ? 'flex' : 'none';
    });
  }

  filterCategory.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);

  // Lightbox gallery effect
  const galleryModal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const imageClose = document.getElementById('imageClose');

  document.addEventListener('click', e => {
    if (e.target.tagName === 'IMG' && e.target.closest('.announcement')) {
      galleryModal.style.display = 'block';
      modalImg.src = e.target.src;
    }
    if (e.target === galleryModal || e.target === imageClose) {
      galleryModal.style.display = 'none';
    }
  });
});
