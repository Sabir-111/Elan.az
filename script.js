document.getElementById('announcementForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (title && content) {
        addAnnouncement(title, content);
        document.getElementById('announcementForm').reset();
    } else {
        alert('Zəhmət olmasa bu bölmələri doldurun!');
    }
});

function addAnnouncement(title, content) {
    const announcementList = document.getElementById('announcementList');

    const newAnnouncement = document.createElement('div');
    newAnnouncement.classList.add('announcement');

    const announcementTitle = document.createElement('h3');
    announcementTitle.textContent = title;

    const announcementContent = document.createElement('p');
    announcementContent.textContent = content;

    newAnnouncement.appendChild(announcementTitle);
    newAnnouncement.appendChild(announcementContent);

    announcementList.appendChild(newAnnouncement);
}
