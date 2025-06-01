const api = 'https://fullstak.onrender.com'


// Cookie helpers
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
  const cname = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) return c.substring(cname.length);
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    setTimeout(() => {
      errorElement.style.display = 'none';
    }, 5000);
  }
}

// Signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const profileInput = document.getElementById('profile');

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (profileInput && profileInput.files[0]) {
      formData.append('profile', profileInput.files[0]);
    }

    try {
      const response = await fetch(`${api}/api/auth/register`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setCookie('token', data.token, 2);
        setCookie('userName', data.user.username, 2);
        window.location.href = 'dashboard.html';
      } else {
        showError('errorMessage', data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      showError('errorMessage', 'Tarmoqqa ulanishda xatolik');
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value.trim();
    const password = loginForm.querySelector('input[type="password"]').value.trim();

    try {
      const response = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setCookie('token', data.token, 2);
        setCookie('userName', data.user.username, 2);
        window.location.href = 'dashboard.html';
      } else {
        showError('errorMessage', data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      showError('errorMessage', 'Tarmoqqa ulanishda xatolik');
    }
  });
}

// Logout
document.querySelectorAll('#logout').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    deleteCookie('token');
    deleteCookie('userName');
    window.location.href = 'login.html';
  });
});

// Load chat messages (for dashboard.html)
async function loadChatMessages() {
  const chatBox = document.getElementById('chatBox');
  const token = getCookie('token');

  try {
    const response = await fetch(`${api}/api/messages`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();

    if (response.ok) {
      chatBox.innerHTML = '';
      data.messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.style.margin = '10px';
        msgDiv.style.padding = '10px';
        msgDiv.style.width = '50%';
        msgDiv.style.background = '#007acc';
        msgDiv.style.color = '#fff';
        msgDiv.style.borderRadius = '12px';
        msgDiv.style.alignSelf = msg.sender_id === data.currentUserId ? 'flex-end' : 'flex-start';

        const textP = document.createElement('p');
        textP.textContent = msg.message;
        msgDiv.appendChild(textP);

        if (msg.image_path) {
          const img = document.createElement('img');
          img.src = `${api}${msg.image_path}`;
          img.style.maxWidth = '200px';
          img.style.display = 'block';
          img.style.marginTop = '5px';
          msgDiv.appendChild(img);
        }

        const timeP = document.createElement('p');
        timeP.textContent = new Date(msg.created_at).toLocaleString();
        timeP.style.fontSize = '0.8em';
        timeP.style.color = '#eee';
        msgDiv.appendChild(timeP);

        chatBox.appendChild(msgDiv);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    } else {
      showError('chatError', data.error || 'Xabarlarni olishda xatolik');
    }
  } catch (error) {
    showError('chatError', 'Xabarlarni yuklashda xatolik: ' + error.message);
  }
}

// Run on load
window.addEventListener('load', () => {
  if (window.location.pathname.includes('dashboard.html')) {
    loadChatMessages();
  }
});
