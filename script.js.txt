document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('announcementForm');
  const list = document.getElementById('announcementList');
  const favList = document.getElementById('favoriteList');
  const modal = document.getElementById('modal');
  const modalForm = document.getElementById('editForm');
  const closeModal = document.querySelector('.modal .close');

  closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  const saved = localStorage.getItem('elanlar');
  if (saved) list.innerHTML = saved;
  const savedFavs = localStorage.getItem('favoritler');
  if (savedFavs) favList.innerHTML = savedFavs;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    const category = form.category.value;
    const price = form.price.value.trim();
    const file = form.image.files[0];
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
        ${imgSrc ? `<img src="${imgSrc}" alt="Şəkil">` : ''}
        <div class="announcement-content">
          <h3>${title}</h3>
          <p class="price">${price} AZN</p>
          <p>${content}</p>
          <small>${date} | ID: ${id} | ${category}</small><br><br>
          <button class="edit">Redaktə et</button>
          <button class="delete">Sil</button>
          <button class="favorite">⭐ Favorit</button>
        </div>`;
      list.prepend(div);
      localStorage.setItem('elanlar', list.innerHTML);
      form.reset();
    };
    if (file) reader.readAsDataURL(file); else reader.onload();
  });

  list.addEventListener('click', e => {
    const card = e.target.closest('.announcement');
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.classList.contains('edit')) {
      modal.style.display = 'block';
      document.getElementById('editId').value = id;
      document.getElementById('editTitle').value = card.querySelector('h3').textContent;
      document.getElementById('editContent').value = card.querySelector('p:not(.price)').textContent;
      document.getElementById('editPrice').value = parseInt(card.querySelector('.price').textContent);
    }
    if (e.target.classList.contains('delete')) {
      card.remove();
      localStorage.setItem('elanlar', list.innerHTML);
    }
    if (e.target.classList.contains('favorite')) {
      const fav = card.cloneNode(true);
      fav.querySelector('.favorite')?.remove();
      favList.appendChild(fav);
      localStorage.setItem('favoritler', favList.innerHTML);
    }
  });

  modalForm.addEventListener('submit', e => {
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
      localStorage.setItem('elanlar', list.innerHTML);
    }
  });

  // Filtrləmə
  const filterCategory = document.getElementById('filterCategory');
  const searchInput = document.getElementById('searchInput');
  function applyFilters() {
    const selected = filterCategory.value;
    const search = searchInput.value.toLowerCase();
    document.querySelectorAll('#announcementList .announcement').forEach(elan => {
      const matchCat = selected === 'Hamısı' || elan.dataset.category === selected;
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
