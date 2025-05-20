
let currentUser = 'guest';

document.getElementById('announcementForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const price = document.getElementById('price').value;
  const id = 'ELN' + Date.now();
  const div = document.createElement('div');
  div.className = 'announcement';
  div.setAttribute('data-id', id);
  div.innerHTML = `<h3>${title}</h3><p>${content}</p><p>${price} AZN</p>`;
  document.getElementById('announcementList').prepend(div);
  renderComments(div, id);
  this.reset();
});

function renderComments(container, id) {
  const commentList = document.createElement('div');
  commentList.className = 'comment-list';
  const comments = JSON.parse(localStorage.getItem('comments_' + id)) || [];

  commentList.innerHTML = comments.map(c => `
    <div class="comment">
      <strong>${c.user}</strong> <small>${c.date}</small>
      <p>${c.text}</p>
    </div>
  `).join('');

  const form = document.createElement('form');
  form.className = 'comment-form';
  form.innerHTML = `
    <textarea placeholder="Şərhinizi yazın..." required></textarea>
    <button type="submit">Göndər</button>
  `;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = this.querySelector('textarea').value.trim();
    if (!text) return;
    const newComment = {
      user: currentUser,
      date: new Date().toLocaleString(),
      text: text
    };
    comments.push(newComment);
    localStorage.setItem('comments_' + id, JSON.stringify(comments));
    renderComments(container, id);
  });

  commentList.appendChild(form);

  const old = container.querySelector('.comment-list');
  if (old) old.remove();
  container.appendChild(commentList);
}
