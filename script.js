let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

  function saveToLocal() {
    localStorage.setItem('accounts', JSON.stringify(accounts));
  }

  function renderTable() {
    const container = document.getElementById('accountTable');
    container.innerHTML = '';
    accounts.forEach((acc, index) => {
      container.innerHTML += `
        <div class="card ${acc.active ? 'active' : 'inactive'}" onclick="copyToClipboard('${acc.login}', '${acc.password}')">
          <p><b>Логин:</b> ${acc.login}</p>
          <p><b>Пароль:</b> ${acc.password}</p>
          <p><b>Статус:</b> ${acc.active ? 'Активирован' : 'Не активирован'}</p>
          <div class="btn-group">
            <button onclick="event.stopPropagation(); toggleStatus(${acc.id})">${acc.active ? 'Деактивировать' : 'Активировать'}</button>
            <button onclick="event.stopPropagation(); deleteAccount(${acc.id})">Удалить</button>
          </div>
        </div>
      `;
    });
  }

  function addAccount() {
    const login = document.getElementById('newLogin').value.trim();
    const password = document.getElementById('newPassword').value.trim();

    if (login && password) {
      const newAccount = {
        id: Date.now(),
        login,
        password,
        active: false
      };
      accounts.push(newAccount);
      saveToLocal();
      renderTable();
addToHistory(`✅ Добавлен аккаунт: ${login}`);//тут нах
addStudentToHistory(newAccount);//нах
      document.getElementById('newLogin').value = '';
      document.getElementById('newPassword').value = '';
    } else {
      alert('Заполни логин и пароль');
    }
  }

  function toggleStatus(id) {
    const acc = accounts.find(a => a.id === id);
    acc.active = !acc.active;
    saveToLocal();
    renderTable();
}
//Удалить акк
  function deleteAccount(id) {
  const deleted = accounts.find(a => a.id === id); // находим аккаунт по ID

  if (!deleted) return; // если не найден — выходим

  const confirmDelete = confirm(`Вы точно хотите удалить аккаунт: ${deleted.login}?`);
  if (!confirmDelete) return;

  accounts = accounts.filter(a => a.id !== id); // удаляем
  saveToLocal();
  renderTable();
  addToHistory(`❌ Удалён аккаунт: ${deleted.login}`); // теперь работает
}


//копирование акк
  function copyToClipboard(login, password) {
    const text = `Логин: ${login}\nПароль: ${password}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Логин и пароль скопированы');
addToHistory(`📋 Скопирован логин и пароль: ${login}`);//тут нах
    }).catch(err => {
      alert('Ошибка копирования');
    });
  }

  renderTable();


document.querySelectorAll(".account-card").forEach(card => {
  card.addEventListener("click", () => {
    const login = card.getAttribute("data-login");
    const password = card.getAttribute("data-password");
    navigator.clipboard.writeText(`${login}:${password}`).then(() => {
      card.classList.add("copied");
      setTimeout(() => card.classList.remove("copied"), 1000);
    });
  });
});


// без интернэта
const total = accounts.length;
const active = accounts.filter(a => a.active).length;
const inactive = total - active;

document.getElementById('counter').innerText = `Всего: ${total} | Активных: ${active} | Не активных: ${inactive}`; 


 if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => {
    console.log("Service Worker зарегистрирован!");
  });
}

 //генератор паролей
 // генерация пароля
function generatePassword(length = 16) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

document.getElementById("generate-btn").addEventListener("click", () => {
  document.getElementById("password").value = generatePassword();
});

// копирование пароля
document.getElementById("copy-btn").addEventListener("click", () => {
  const passwordField = document.getElementById("password");
  navigator.clipboard.writeText(passwordField.value).then(() => {
    alert("Пароль скопирован!");
  });
});
// меню 
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");

  menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("active");
    menuButton.classList.toggle("open");
  });

  // Закрытие меню при клике вне его области
  document.addEventListener("click", function (event) {
  const isClickInsideSidebar = sidebar.contains(event.target);
  const isClickOnMenuButton = menuButton.contains(event.target);
  const isClickInsideModal = event.target.closest(".modal-content"); // модалки

  if (!isClickInsideSidebar && !isClickOnMenuButton && !isClickInsideModal) {
    sidebar.classList.remove("active");
    menuButton.classList.remove("open");
  }
});
});

//клик в меню
// Открыть/закрыть модалку
const modal = document.getElementById("modal");
const openCreateBtn = document.getElementById("openCreateModal");
const closeModalBtn = document.getElementById("closeModal");

openCreateBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

function closeModal() {
  modal.style.display = "none";
}

// Закрытие при клике вне окна
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Кнопка "Генератор кодов"
document.getElementById("openGenerator").addEventListener("click", () => {
  document.getElementById("password").scrollIntoView({ behavior: "smooth" });
});

//
// генератор модалка
const generatorModal = document.getElementById("generatorModal");
const openGeneratorBtn = document.getElementById("openGenerator");
const closeGeneratorBtn = document.getElementById("closeGeneratorModal");

openGeneratorBtn.addEventListener("click", () => {
  generatorModal.style.display = "block";
});

closeGeneratorBtn.addEventListener("click", () => {
  generatorModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === generatorModal) {
    generatorModal.style.display = "none";
  }
});

//
document.getElementById("copy-btn").addEventListener("click", () => {
  const passwordField = document.getElementById("password");
  navigator.clipboard.writeText(passwordField.value).then(() => {
    alert("Пароль скопирован!");
    document.getElementById("generatorModal").style.display = "none"; // Закрыть модалку
  });
});

// закрыть при сахронений 
function closeMenu() {
  document.getElementById("sidebar").classList.remove("active");
  document.getElementById("menuButton").classList.remove("open");
}


//история
// История действий
let historyLog = JSON.parse(localStorage.getItem('history')) || [];

function addToHistory(action) {
  const time = new Date().toLocaleTimeString();
  historyLog.unshift(`[${time}] ${action}`);
  localStorage.setItem('history', JSON.stringify(historyLog));
}

function renderHistory() {
  const logContainer = document.getElementById("historyLog");
  if (logContainer) {
    logContainer.innerHTML = historyLog.map(entry => `<div class="log-entry">${entry}</div>`).join('');
  }
}

// Модалка истории
const historyModal = document.getElementById("historyModal");
const openHistoryBtn = document.getElementById("openHistory");
const closeHistoryBtn = document.getElementById("closeHistoryModal");

if (openHistoryBtn && historyModal && closeHistoryBtn) {
  openHistoryBtn.addEventListener("click", () => {
    renderHistory();
    historyModal.style.display = "block";
  });

  closeHistoryBtn.addEventListener("click", () => {
    historyModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === historyModal) {
      historyModal.style.display = "none";
    }
  });
}

//очистить историю
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener("click", () => {
    const confirmClear = confirm("Очистить всю историю?");
    if (confirmClear) {
      historyLog = [];
      localStorage.removeItem("history");
      renderHistory();
      addToHistory("🧹 История очищена пользователем");
    }
  });
}

// отправть инструкцию
const avitoModal = document.getElementById("avitoModal");
const closeAvitoModal = document.getElementById("closeAvitoModal");
const copyAndGoAvitoBtn = document.getElementById("copyAndGoAvitoBtn");

// Открытие из меню
document.getElementById("openAvito").addEventListener("click", () => {
  avitoModal.style.display = "block";
  //closeMenu();
});

// Закрытие модалки
closeAvitoModal.addEventListener("click", () => {
  avitoModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === avitoModal) {
    avitoModal.style.display = "none";
  }
});

// Копировать и открыть Авито
document.getElementById("copyAndGoAvitoBtn").addEventListener("click", () => {
  const message = document.getElementById("clientText")?.value.trim();
  if (!message) return alert("Введите сообщение для копирования");

  navigator.clipboard.writeText(message).then(() => {
    window.location.href = "https://www.avito.ru/";
  }).catch(() => {
    alert("Не удалось скопировать текст");
  });
});

//создать студ фэк
// ======= МОДАЛКА генерации студента =======
// ======= МОДАЛКА генерации студента =======
const fakeModal = document.getElementById("fakeModal");
const genFakeBtn = document.getElementById("genFakeBtn");
const fakeStatus = document.getElementById("fakeStatus");
const closeFakeModal = document.getElementById("closeFakeModal");

document.getElementById("generateFakeStudent").addEventListener("click", () => {
  fakeModal.style.display = "block";
  //closeMenu?.();
});
closeFakeModal.addEventListener("click", () => {
  fakeModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === fakeModal) fakeModal.style.display = "none";
});

// ======= ИСТОРИЯ студентов =======
let studentHistory = JSON.parse(localStorage.getItem("studentHistory")) || [];

function saveStudentHistory() {
  localStorage.setItem("studentHistory", JSON.stringify(studentHistory));
}

function renderStudentHistory() {
  const container = document.getElementById("studentHistoryLog");
  if (!container) return;
  container.innerHTML = studentHistory.map(s => `
    <div class="student-entry">
      <b>${s.name}</b> (${s.birthday})<br>
      Email: ${s.email || '-'}<br>
      Телефон: ${s.phone || '-'}<br>
      Адрес: ${s.address || '-'}<br>
      Девичья фамилия матери: ${s.maiden || '-'}<br>
      <i>Создано: ${s.createdAt}</i>
    </div>
  `).join('<hr>');
}

function addStudentToHistory(student) {
  const entry = {
    name: student.name,
    birthday: student.birthday,
    email: student.email,
    phone: student.phone,
    address: student.address,
    maiden: student.maiden,
    createdAt: new Date().toLocaleString("ru-RU")
  };
  studentHistory.unshift(entry);
  saveStudentHistory();
  renderStudentHistory();
}

// ======= ГЕНЕРАЦИЯ фейк-студента =======
genFakeBtn.addEventListener("click", async () => {
  fakeStatus.textContent = "Генерация...";
  genFakeBtn.disabled = true;

  try {
    const rand = Math.random();
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://www.fakenamegenerator.com/advanced.php?t=country&n[]=us&c[]=us&gen=1&age-min=18&age-max=21&rand=${rand}`
    )}`;

    const res = await fetch(proxyUrl);
    const data = await res.json();
    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');

    const name = doc.querySelector("h3")?.textContent.trim();
    const address = doc.querySelector(".adr")?.textContent.trim();

    const getField = (label) => {
      const dt = Array.from(doc.querySelectorAll("dl dt")).find(dt => dt.textContent.includes(label));
      return dt ? dt.nextElementSibling?.textContent.trim() : "";
    };

    const student = {
      name,
      address,
      birthday: getField("Birthday"),
      email: getField("Email Address"),
      phone: getField("Phone"),
      maiden: getField("Mother's maiden name")
    };

    addStudentToHistory(student);
    fakeStatus.textContent = "✅ Готово!";
    fakeModal.style.display = "none";
  } catch (e) {
    console.error(e);
    fakeStatus.textContent = "Ошибка генерации";
  } finally {
    genFakeBtn.disabled = false;
    setTimeout(() => (fakeStatus.textContent = ""), 3000);
  }
});

// ======= ИСТОРИЯ модалка =======
const studentHistoryModal = document.getElementById("studentHistoryModal");
const closeStudentHistoryModal = document.getElementById("closeStudentHistoryModal");

document.getElementById("openStudentHistory").addEventListener("click", () => {
  renderStudentHistory();
  studentHistoryModal.style.display = "block";
  //closeMenu?.();
});
closeStudentHistoryModal.addEventListener("click", () => {
  studentHistoryModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === studentHistoryModal) studentHistoryModal.style.display = "none";
});

// ======= ОЧИСТКА истории =======
document.getElementById("clearStudentHistoryBtn").addEventListener("click", () => {
  if (confirm("Удалить всю историю студентов?")) {
    studentHistory = [];
    localStorage.removeItem("studentHistory");
    renderStudentHistory();
    addToHistory?.("🧹 История студентов очищена");
  }
});