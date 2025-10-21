const menuBtn = document.querySelector('.menu-btn');
const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
const closeSidebarBtn = document.querySelector('.close-sidebar');
const addBtn = document.querySelector('.add-task');
let addPopup = document.querySelector('.add-popup');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalCard = document.querySelector('.modal-card');
const modalTitle = document.querySelector('.modal-title');
const modalClose = document.querySelector('.modal-close');
const modalForm = document.querySelector('.modal-form');
const addOptions = document.querySelectorAll('.add-option');
const appShell = document.querySelector('.app-shell');

function openSidebar() {
  sidebarBackdrop.classList.add('open');
  sidebarBackdrop.querySelector('.sidebar-panel').setAttribute('aria-hidden', 'false');
  sidebarBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  sidebarBackdrop.classList.remove('open');
  sidebarBackdrop.querySelector('.sidebar-panel').setAttribute('aria-hidden', 'true');
  sidebarBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (sidebarBackdrop.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', (e) => {
  if (e.target === sidebarBackdrop) {
    closeSidebar();
  }
});

// ✅ Fixed Add Popup logic
if (addPopup && addBtn) {
  document.body.appendChild(addPopup);

  function placeAddPopup() {
    const btnRect = addBtn.getBoundingClientRect();
    const popupRect = addPopup.getBoundingClientRect();
    const spaceBelow = window.innerHeight - btnRect.bottom;
    const spaceAbove = btnRect.top;
    const margin = 8;

    let top;
    if (spaceBelow >= popupRect.height + margin) {
      top = window.scrollY + btnRect.bottom + 8;
    } else if (spaceAbove >= popupRect.height + margin) {
      top = window.scrollY + btnRect.top - popupRect.height - 8;
    } else if (spaceBelow >= spaceAbove) {
      top = window.scrollY + btnRect.bottom + 8;
    } else {
      top = Math.max(8, window.scrollY + btnRect.top - popupRect.height - 8);
    }

    let left = window.scrollX + btnRect.right - popupRect.width;
    if (left < 8) left = 8;
    if (left + popupRect.width > window.innerWidth - 8)
      left = window.innerWidth - popupRect.width - 8;

    addPopup.style.top = `${Math.round(top)}px`;
    addPopup.style.left = `${Math.round(left)}px`;
  }

  function openAddPopup() {
    addPopup.classList.add('open');
    addPopup.setAttribute('aria-hidden', 'false');
    placeAddPopup();
    window.addEventListener('resize', placeAddPopup);
    window.addEventListener('scroll', placeAddPopup, { passive: true });
    setTimeout(() => document.addEventListener('click', onDocClickForAdd), 0);
  }

  function closeAddPopup() {
    addPopup.classList.remove('open');
    addPopup.setAttribute('aria-hidden', 'true');
    window.removeEventListener('resize', placeAddPopup);
    window.removeEventListener('scroll', placeAddPopup);
    document.removeEventListener('click', onDocClickForAdd);
  }

  function onDocClickForAdd(e) {
    if (!addPopup.contains(e.target) && e.target !== addBtn) {
      closeAddPopup();
    }
  }

  addBtn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (addPopup.classList.contains('open')) closeAddPopup();
    else openAddPopup();
  });

  addPopup.addEventListener('click', (e) => e.stopPropagation());
}

function openModal(type) {
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  modalCard.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (type === 'subject') {
    modalTitle.textContent = 'Add Subject Schedule';
  } else if (type === 'performance') {
    modalTitle.textContent = 'Add Performance Task';
  } else if (type === 'test') {
    modalTitle.textContent = 'Add Upcoming Test';
  } else {
    modalTitle.textContent = 'Add Task';
  }
  const nameInput = modalForm.querySelector('input[name="name"]');
  if (nameInput) nameInput.focus();
}
function closeModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  modalCard.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

addOptions.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const type = btn.dataset.type;
    closeAddPopup();
    openModal(type);
  });
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) {
    closeModal();
  }
});
appShell.addEventListener('click', () => {
  if (addPopup.classList.contains('open')) {
    addPopup.classList.remove('open');
    addPopup.setAttribute('aria-hidden', 'true');
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalBackdrop.classList.contains('open')) closeModal();
    if (sidebarBackdrop.classList.contains('open')) closeSidebar();
    if (addPopup.classList.contains('open')) addPopup.classList.remove('open');
  }
});
modalForm.addEventListener('submit', (e) => {
  e.preventDefault();
  closeModal();
});
const cancelBtn = modalForm.querySelector('.cancel');
if (cancelBtn) {
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });
}
