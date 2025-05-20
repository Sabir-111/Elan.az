let currentUser = '';

function login() {
  const user = document.getElementById('username').value.trim();
  if (!user) return alert("İstifadəçi adını daxil edin!");
  currentUser = user;
  document.getElementById('loggedUser').innerText = "Daxil olundu: " + currentUser;
  document.getElementById('sendMessage').style.display = 'block';
  document.getElementById('inbox').style.display = 'block';
  document.getElementById('sent').style.display = 'block';
  loadMessages();
}

function sendMessage() {
  const to = document.getElementById('receiver').value.trim();
  const text = document.getElementById('messageText').value.trim();
  if (!to || !text) return alert("Məlumatları tam doldurun!");
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push({ from: currentUser, to, text, date: new Date().toLocaleString() });
  localStorage.setItem('messages', JSON.stringify(messages));
  document.getElementById('messageText').value = '';
  alert("Mesaj göndərildi!");
  loadMessages();
}

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const inbox = messages.filter(m => m.to === currentUser);
  const sent = messages.filter(m => m.from === currentUser);

  document.getElementById('inboxList').innerHTML = inbox.map(m => `
    <div class="message"><strong>${m.from}</strong> → ${m.to}
      <br>${m.text}<br><small>${m.date}</small></div>
  `).join('');

  document.getElementById('sentList').innerHTML = sent.map(m => `
    <div class="message"><strong>${m.from}</strong> → ${m.to}
      <br>${m.text}<br><small>${m.date}</small></div>
  `).join('');
}
