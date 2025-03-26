
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
function generatePassword(length = 12) {
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
    if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
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
  closeMenu();
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
copyAndGoAvitoBtn.addEventListener("click", () => {
  const message = document.getElementById("clientText").value.trim();

  navigator.clipboard.writeText(message).then(() => {
    // Только после успешного копирования — открываем
    const newWindow = window.open("https://m.avito.ru/", "_blank");

    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      alert("Не удалось открыть Авито. Разрешите всплывающие окна в браузере.");
    }
  }).catch(() => {
    alert("Не удалось скопировать сообщение");
  });
});

//создать студ фэк
// Модалка генерации
const fakeModal = document.getElementById("fakeModal");
const closeFakeModal = document.getElementById("closeFakeModal");
const genFakeBtn = document.getElementById("genFakeBtn");

document.getElementById("generateFakeStudent").addEventListener("click", () => {
  fakeModal.style.display = "block";
  closeMenu?.(); // если у тебя есть закрытие меню
});

closeFakeModal.addEventListener("click", () => {
  fakeModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === fakeModal) {
    fakeModal.style.display = "none";
  }
});

// История студентов
let studentHistory = JSON.parse(localStorage.getItem("studentHistory")) || [];

function addStudentToHistory(student) {
  const now = new Date().toLocaleString("ru-RU");
  const entry = {
    login: student.login,
    birthday: student.birthday,
    email: student.email,
    phone: student.phone,
    address: student.address,
    country: student.country,
    flag: student.flag,
    createdAt: now
  };

  studentHistory.unshift(entry);
  localStorage.setItem("studentHistory", JSON.stringify(studentHistory));
  renderStudentHistory();
}

function renderStudentHistory() {
  const container = document.getElementById("studentHistoryLog");
  if (!container) return;

  container.innerHTML = studentHistory.map(s => `
    <div class="student-entry">
      <b><img src="${s.flag}" style="vertical-align: middle;"> ${s.login}</b> (${s.birthday})<br>
      Email: ${s.email}<br>
      Телефон: ${s.phone}<br>
      Адрес: ${s.address}<br>
      Страна: ${s.country}<br>
      <i>Создано: ${s.createdAt}</i>
    </div>
  `).join('');
}

// Модалка истории
const studentHistoryModal = document.getElementById("studentHistoryModal");
const closeStudentHistoryModal = document.getElementById("closeStudentHistoryModal");

document.getElementById("openStudentHistory").addEventListener("click", () => {
  renderStudentHistory();
  studentHistoryModal.style.display = "block";
  closeMenu?.();
});

closeStudentHistoryModal.addEventListener("click", () => {
  studentHistoryModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === studentHistoryModal) {
    studentHistoryModal.style.display = "none";
  }
});

// Очистка истории
const clearStudentHistoryBtn = document.getElementById("clearStudentHistoryBtn");

clearStudentHistoryBtn.addEventListener("click", () => {
  if (confirm("Удалить всю историю студентов?")) {
    studentHistory = [];
    localStorage.removeItem("studentHistory");
    renderStudentHistory();
    addToHistory?.("🧹 История студентов очищена");
  }
});

// Генерация студента через API
function getCountryName(code) {
  const map = {
    US: "USA",
    GB: "UK",
    CA: "Canada",
    NZ: "New Zealand",
    AU: "Australia"
  };
  return map[code] || code;
}

function tryGenerateStudent(retries = 5) {
  if (retries <= 0) {
    alert("Не удалось найти подходящего студента. Попробуй позже.");
    return;
  }

  fetch("https://randomuser.me/api/?nat=us,gb,ca,nz,au")
    .then(res => res.json())
    .then(data => {
      const user = data.results[0];
      const age = user.dob.age;

      if (age >= 18 && age <= 21) {
        const first = user.name.first;
        const last = user.name.last;
        const login = `${first}${last}`;
        const password = user.login.password;
        const email = user.email;
        const phone = user.phone;
        const address = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}`;
        const birthday = new Date(user.dob.date).toLocaleDateString("en-US");
        const countryCode = user.nat.toLowerCase();
        const country = getCountryName(user.nat);
        const flag = `https://flagcdn.com/24x18/${countryCode}.png`;

        const newAccount = {
          id: Date.now(),
          login,
          password,
          active: false,
          email,
          phone,
          address,
          birthday,
          country,
          flag
        };

        accounts.push(newAccount);
        saveToLocal();
        renderTable();
        addToHistory?.(`🎓 Добавлен студент: ${login} (${country})`);
        addStudentToHistory(newAccount);
        fakeModal.style.display = "none";
      } else {
        setTimeout(() => tryGenerateStudent(retries - 1), 300);
      }
    })
    .catch(() => {
      alert("Ошибка при генерации студента");
    });
}

genFakeBtn.addEventListener("click", () => {
  tryGenerateStudent();
});
