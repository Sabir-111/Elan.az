let users = JSON.parse(localStorage.getItem("users") || "{}");
let announcements = JSON.parse(localStorage.getItem("announcements") || "[]");
let currentUser = "";

document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const u = document.getElementById("regUsername").value.trim();
  const p = document.getElementById("regPassword").value;
  if (users[u]) return alert("İstifadəçi mövcuddur.");
  users[u] = { password: p };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Qeydiyyat tamam!");
  this.reset();
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const u = document.getElementById("loginUsername").value.trim();
  const p = document.getElementById("loginPassword").value;
  if (!users[u] || users[u].password !== p) return alert("Yanlış məlumat!");
  currentUser = u;
  document.getElementById("welcomeUser").innerText = "Salam, " + currentUser;
  document.getElementById("userPanel").style.display = "block";
  document.getElementById("announcementFormSection").style.display = "block";
  if (currentUser === "admin") document.getElementById("adminPanel").style.display = "block";
  render();
});

function logout() {
  currentUser = "";
  location.reload();
}

document.getElementById("announcementForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  announcements.push({ user: currentUser, title, content, approved: false });
  localStorage.setItem("announcements", JSON.stringify(announcements));
  alert("Elan əlavə olundu!");
  this.reset();
  render();
});

function render() {
  const pending = document.getElementById("pendingList");
  const approved = document.getElementById("approvedList");
  pending.innerHTML = "";
  approved.innerHTML = "";
  announcements.forEach((a, i) => {
    const el = document.createElement("div");
    el.className = "announcement";
    el.innerHTML = `<strong>${a.title}</strong><br>${a.content}<br><small>Göndərən: ${a.user}</small>`;
    if (a.approved) {
      approved.appendChild(el);
    } else if (currentUser === "admin") {
      const btn = document.createElement("button");
      btn.textContent = "Təsdiqlə";
      btn.onclick = () => {
        announcements[i].approved = true;
        localStorage.setItem("announcements", JSON.stringify(announcements));
        render();
      };
      el.appendChild(btn);
      pending.appendChild(el);
    }
  });
}
