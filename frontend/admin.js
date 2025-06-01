const api = 'https://fullstak.onrender.com'

let selectedUserId = null;

// Foydalanuvchilar ro'yxatini yuklash
async function loadUsers() {
  try {
    const res = await fetch(`${api}/api/admin/users`);
    const users = await res.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    users.forEach(user => {
      const div = document.createElement('div');
      div.textContent = user.name;
      div.style = 'padding: 10px; background: #2a2f3a; margin-bottom: 10px; cursor: pointer; border-radius: 8px;';
      div.onclick = () => loadChat(user.id, user.name);
      userList.appendChild(div);
    });
  } catch (err) {
    console.error("Foydalanuvchilarni yuklashda xatolik:", err);
  }
}

// Tanlangan foydalanuvchi bilan chatni yuklash
async function loadChat(userId, name) {
  selectedUserId = userId;
  document.getElementById('chatHeader').textContent = name;

  try {
    const res = await fetch(`${api}/api/admin/messages/${userId}`);
    const messages = await res.json();
    const box = document.getElementById('chatBox');
    box.innerHTML = '';

    messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.style = `
        max-width: 70%;
        margin: 6px;
        padding: 10px 14px;
        border-radius: 10px;
        background: ${msg.from === 'admin' ? '#333' : '#00f6ff'};
        color: ${msg.from === 'admin' ? '#fff' : '#000'};
        align-self: ${msg.from === 'admin' ? 'flex-start' : 'flex-end'};
        display: flex;
        flex-direction: column;
      `;

      if (msg.text) {
        const textP = document.createElement('p');
        textP.textContent = msg.text;
        textP.style.margin = '0 0 5px 0';
        msgDiv.appendChild(textP);
      }

      if (msg.image) {
        const img = document.createElement('img');
        img.src = `${api}${msg.image}`;
        img.style.maxWidth = '200px';
        img.style.borderRadius = '6px';
        img.style.marginTop = '5px';
        msgDiv.appendChild(img);
      }

      box.appendChild(msgDiv);
    });

    box.scrollTop = box.scrollHeight;
  } catch (err) {
    console.error("Chatni yuklashda xatolik:", err);
  }
}

// Javob yuborish
async function sendReply() {
  const input = document.getElementById('adminMessage');
  const text = input.value.trim();
  if (!text || !selectedUserId) return;

  try {
    await fetch(`${api}/api/admin/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUserId, text })
    });

    input.value = '';
    loadChat(selectedUserId, document.getElementById('chatHeader').textContent);
  } catch (err) {
    console.error("Javob yuborishda xatolik:", err);
  }
}

// Boshlanishda yuklash
window.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  document.getElementById('sendReply').addEventListener('click', sendReply);
  document.getElementById('logout').addEventListener('click', () => {
    window.location.href = 'login.html';
  });
});
