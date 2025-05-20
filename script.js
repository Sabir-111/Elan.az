let currentUser = prompt("İstifadəçi adınızı daxil edin:");
if (currentUser === "admin") {
  document.getElementById("adminMessages").style.display = "block";
  renderMessages();
}

document.getElementById("announcementForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  const price = document.getElementById("price").value;
  const div = document.createElement("div");
  div.className = "announcement";
  div.innerHTML = `<h3>${title}</h3><p>${content}</p><p>${price} AZN</p>`;
  document.getElementById("announcementList").prepend(div);
  this.reset();
});

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;
  const data = { name, email, message, date: new Date().toLocaleString() };

  let all = JSON.parse(localStorage.getItem("messages")) || [];
  all.push(data);
  localStorage.setItem("messages", JSON.stringify(all));

  this.reset();
  document.getElementById("contactSuccess").style.display = "block";
  setTimeout(() => document.getElementById("contactSuccess").style.display = "none", 4000);

  renderMessages();
});

function renderMessages() {
  const box = document.getElementById("messageList");
  if (!box) return;
  const messages = JSON.parse(localStorage.getItem("messages")) || [];
  box.innerHTML = messages.map(m => `
    <div class="message-box">
      <strong>${m.name} (${m.email})</strong>
      <small>${m.date}</small>
      <p>${m.message}</p>
    </div>
  `).join('');
}
