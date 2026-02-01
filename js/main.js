/* ========================================================================================
                                     DOM ELEMENTS
======================================================================================== */
const todoList = document.querySelector('.todo-list');
const messageText = document.querySelector('.message-text');
const addTodoBtn = document.querySelector('#addTodoBtn');

const formModal = document.querySelector('#formModal');
const formModalTitle = document.querySelector('#formModal .modal-title');
const modalInput = document.querySelector('#modalInput');
const confirmSaveBtn = document.querySelector('#confirmSaveBtn');

const deleteModal = document.querySelector('#deleteModal');
const deleteModalTitle = document.querySelector('#deleteModal .modal-title');
const confirmDeleteBtn = document.querySelector('#confirmDeleteBtn');

const closeXBtns = document.querySelectorAll('.close-x-btn');
const cancelBtns = document.querySelectorAll('.cancel-btn');

const searchTodoInput = document.querySelector('#searchTodoInput');

const filterBtn = document.querySelector('.filter-btn');
const filterLabel = document.querySelector('.filter-label');
const sortMenu = document.querySelector('.sort-menu');
const sortBtns = document.querySelectorAll('.sort-btn');

const paginationContainer = document.querySelector('.pagination');

const changeThemeBtn = document.querySelector('#changeThemeBtn');
const themesPalette = document.querySelector('.themes');
const themeBtns = document.querySelectorAll('.theme-btn');
const body = document.querySelector('body');

const lightColor = getComputedStyle(document.documentElement).getPropertyValue('--light-color');
/* ========================================================================================
                                     INITIAL STATE
======================================================================================== */

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let visibleTodos = [...todos];
let todoIdtoEdited = null;
let todoIdtoDeleted = null;
let todoIdToCheck = null;

/* ========================================================================================
                                      FUNCTIONS
======================================================================================== */
const renderTodos = (shownTodos) => {
  todoList.innerHTML = '';
  if (shownTodos.length == 0) {
    todoList.innerHTML = `<p class="message-text">موردی برای نمایش وجود ندارد.</p>`;
  } else {
    shownTodos.forEach((todo) => {
      todoList.insertAdjacentHTML(
        'beforeend',
        `
         <article class="todo-item ${todo.isCompleted ? 'completed' : ''}" data-id=${todo.id}>
            <div class="todo-info">
              <label class="custom-checkbox">
                <input type="checkbox" name="todo-checkbox" class="todo-checkbox" ${todo.isCompleted ? 'checked' : ''}/>
                <span></span>
              </label>
              <p class="todo-text">${todo.title}</p>
            </div>

            <div class="todo-actions">
              <button type="button" class="edit-btn">
                <i class="fa-light fa-pen-to-square"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fa-light fa-trash-can"></i>
              </button>
            </div>
          </article>`,
      );
    });
  }
};

const saveTodosToLocalStorage = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const showModal = (modal, modalTitleElem, title) => {
  modal.classList.add('show');
  modalTitleElem.textContent = title;
  setTimeout(() => {
    modalInput.focus();
  }, 100);
};

const hideModal = (modal) => {
  modal.classList.remove('show');
};

const showSuccessAlert = (message) => {
  Swal.fire({
    toast: true,
    position: 'top-start',
    icon: 'success',
    text: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#f1f0fe',
    customClass: {
      popup: 'my-toast',
    },
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    text: message,
    showConfirmButton: true,
    confirmButtonText: 'باشه',
    background: '#f1f0fe',
    customClass: {
      popup: 'my-popup',
      icon: 'popup-icon',
      confirmButton: 'popup-confirm-button',
    },
  });
};

const sortTodos = () => {
  const completedTodos = visibleTodos.filter((todo) => todo.isCompleted === true);
  const pendingTodos = visibleTodos.filter((todo) => todo.isCompleted === false);
  if (filterLabel.dataset.value === 'completed') {
    renderTodos(completedTodos);
  } else if (filterLabel.dataset.value === 'pending') {
    renderTodos(pendingTodos);
  } else {
    renderTodos(visibleTodos);
  }
};

const updateVisibleTodos = () => {
  const searchValue = searchTodoInput.value.toLowerCase().trim();
  if (searchValue) {
    visibleTodos = todos.filter((todo) => todo.title.toLowerCase().includes(searchValue));
  } else {
    visibleTodos = [...todos];
  }
};

const addTodo = () => {
  const todoTitle = modalInput.value.trim();
  if (!todoTitle) {
    showErrorAlert('عنوان تسک نباید خالی باشد.');
  } else {
    const isExist = todos.some((todo) => todo.title === todoTitle);
    if (isExist) {
      showErrorAlert('عنوان تسک تکراری است.');
    } else {
      const newTodo = {
        id: crypto.randomUUID(),
        title: todoTitle,
        isCompleted: false,
      };

      todos.push(newTodo);
      saveTodosToLocalStorage();
      hideModal(formModal);
      modalInput.value = '';
      updateVisibleTodos();
      sortTodos();
      showSuccessAlert('تسک با موفقیت اضافه شد.');
    }
  }
};

const editTodo = () => {
  let findTodoToEdited;
  const todoTitle = modalInput.value.trim();
  if (!todoTitle) {
    showErrorAlert('عنوان تسک نباید خالی باشد.');
  } else {
    findTodoToEdited = todos.find((todo) => todo.title === todoTitle);

    if (findTodoToEdited && findTodoToEdited.id !== todoIdtoEdited) {
      showErrorAlert('عنوان تسک تکراری است.');
    } else {
      findTodoToEdited = todos.find((todo) => todo.id === todoIdtoEdited);
      findTodoToEdited.title = todoTitle;
      saveTodosToLocalStorage();
      hideModal(formModal);
      modalInput.value = '';
      updateVisibleTodos();
      sortTodos();
      showSuccessAlert('تسک با موفقیت ویرایش شد.');
    }
  }
};

const deleteTodo = () => {
  const findIndexTodo = todos.findIndex((todo) => todo.id === todoIdtoDeleted);
  todos.splice(findIndexTodo, 1);
  saveTodosToLocalStorage();
  updateVisibleTodos();
  hideModal(deleteModal);
  sortTodos();
  showSuccessAlert('تسک با موفقیت حذف شد.');
};

const completeTodo = () => {
  let findTodoToComplete = todos.find((todo) => todo.id === todoIdToCheck);
  findTodoToComplete.isCompleted = !findTodoToComplete.isCompleted;
  saveTodosToLocalStorage();
  updateVisibleTodos();
  sortTodos();
  if (findTodoToComplete.isCompleted) {
    showSuccessAlert('تسک با موفقیت تکمیل شد.');
  } else {
    showSuccessAlert('تسک از حالت تکمیل خارج شد.');
  }
};

const searchTodos = () => {
  updateVisibleTodos();
  sortTodos();
};

const changeTheme = (themeBtn) => {
  const themeTitle = themeBtn.dataset.theme;

  // Apply theme to body
  body.dataset.theme = themeTitle;

  // Remove active from all buttons
  themeBtns.forEach((btn) => {
    btn.classList.remove('active');
  });

  // Set active button
  themeBtn.classList.add('active');

  // Save theme to localStorage
  localStorage.setItem('theme', themeTitle);
};

/* ========================================================================================
                                      EVENT LISTENERS
======================================================================================== */

// Initialize app state on page load
window.addEventListener('load', () => {
  renderTodos(visibleTodos);

  // Apply saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'default';
  body.dataset.theme = savedTheme;

  // Set active theme button
  themeBtns.forEach((btn) => {
    if (btn.dataset.theme === savedTheme) {
      btn.classList.add('active');
    } 
  });
});

// Show add todo modal
addTodoBtn.addEventListener('click', () => {
  modalInput.value = '';
  showModal(formModal, formModalTitle, 'ایجاد تسک جدید');
  todoIdtoEdited = null;
});

// actions (delete, edit, complete)
todoList.addEventListener('click', (event) => {
  // Show edit Modal
  if (event.target.closest('.edit-btn')) {
    todoIdtoEdited = event.target.closest('.todo-item').dataset.id;
    const findTodo = visibleTodos.find((todo) => todo.id === todoIdtoEdited);
    modalInput.value = findTodo.title;
    showModal(formModal, formModalTitle, 'ویرایش تسک');
  }

  // Show delete Modal
  if (event.target.closest('.delete-btn')) {
    todoIdtoDeleted = event.target.closest('.todo-item').dataset.id;
    showModal(deleteModal, deleteModalTitle, 'حذف تسک');
  }

  // Complete todo
  if (event.target.closest('.todo-checkbox')) {
    todoIdToCheck = event.target.closest('.todo-item').dataset.id;
    completeTodo();
  }
});

// Close modals and theme palette using close buttons or Escape key
closeXBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    hideModal(modal);
  });
});

cancelBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal');
    hideModal(modal);
  });
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    hideModal(formModal);
    hideModal(deleteModal);
    themesPalette.classList.remove('open');
  }
});

// Close modals, theme palette, and sort menu when clicking outside
document.addEventListener('click', (event) => {
  if (event.target === formModal) {
    hideModal(formModal);
  }
  if (event.target === deleteModal) {
    hideModal(deleteModal);
  }

  if (themesPalette.classList.contains('open') && !themesPalette.contains(event.target) && !changeThemeBtn.contains(event.target)) {
    themesPalette.classList.remove('open');
  }

  if (sortMenu.classList.contains('open') && !filterBtn.contains(event.target) && !sortMenu.contains(event.target)) {
    sortMenu.classList.remove('open');
  }
});

// Confirm add/Edit todo
confirmSaveBtn.addEventListener('click', () => {
  if (todoIdtoEdited) {
    editTodo();
  } else {
    addTodo();
  }
});

// Confirm delete todo
confirmDeleteBtn.addEventListener('click', deleteTodo);

// Search
searchTodoInput.addEventListener('input', searchTodos);

// Open sort Menu
filterBtn.addEventListener('click', () => {
  sortMenu.classList.toggle('open');
});

// Handle sort option selection and update todo list
sortBtns.forEach((sortBtn) => {
  sortBtn.addEventListener('click', () => {
    filterLabel.textContent = sortBtn.textContent;
    filterLabel.dataset.value = sortBtn.value;
    sortMenu.classList.remove('open');

    sortTodos();
  });
});

// Toggle theme palette on button click
changeThemeBtn.addEventListener('click', () => {
  themesPalette.classList.toggle('open');
});

// Close theme palette on small screen resize
window.addEventListener('resize', () => {
  if (window.innerWidth < 767) {
    themesPalette.classList.remove('open');
  }
});

// Change theme on click
themeBtns.forEach((themeBtn) => {
  themeBtn.addEventListener('click', () => {
    changeTheme(themeBtn);
  });
});
