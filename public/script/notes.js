const fontSelect = document.getElementById ('font');
const noteDiv = document.querySelector ('.note');
const fontSizeSelect = document.getElementById ('fontSize');
const notesList = document.getElementById ('notesList');
const boldBtn = document.getElementById ('boldBtn');
const italicBtn = document.getElementById ('italicBtn');
const underlineBtn = document.getElementById ('underlineBtn');
const alignLeft = document.getElementById ('alignLeft');
const alignCenter = document.getElementById ('alignCenter');
const alignRight = document.getElementById ('alignRight');
const alignJustify = document.getElementById ('alignJustify');

let notes = JSON.parse (localStorage.getItem ('notes')) || [];
let history = [];
let historyIndex = -1;

function loadNotes () {
  notes.forEach (note => {
    addNoteToList (note);
  });
}

function addNoteToList (note) {
  const li = document.createElement ('li');

  const titleContainer = document.createElement ('div');
  titleContainer.onclick = () => editNote (note);

  const img = document.createElement ('img');
  img.src = '/assets/icon-bulu.png';
  img.alt = 'Icon';
  img.style.width = '20px';
  img.style.height = '20px';
  img.style.marginRight = '10px';

  const title = document.createElement ('span');
  title.className = 'note-title';
  title.textContent = note.title;

  titleContainer.appendChild (img);
  titleContainer.appendChild (title);

  const deleteBtn = document.createElement ('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.innerHTML = '<img src="/assets/icon-tong-sampah.png" alt="Hapus">';

  deleteBtn.onclick = () => deleteNote (note.title);

  li.appendChild (titleContainer);
  li.appendChild (deleteBtn);

  notesList.appendChild (li);
}

function editNote (note) {
  document.getElementById ('title').value = note.title;
  noteDiv.innerHTML = note.content; // Load formatted content
  updateDropdowns (); // Update dropdowns when editing a note
  resetAlignmentButtons (); // Reset alignment buttons on edit
}

function resetAlignmentButtons () {
  document.querySelectorAll ('.align-btn').forEach (btn => {
    btn.classList.remove ('selected');
  });
}

function deleteNote (title) {
  notes = notes.filter (note => note.title !== title);
  localStorage.setItem ('notes', JSON.stringify (notes));
  notesList.innerHTML = '';
  loadNotes ();
}

function updateFontAndSize () {
  const selection = window.getSelection ();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt (0);
    const selectedNode = range.startContainer.nodeType === 3
      ? range.startContainer.parentNode
      : range.startContainer;

    if (
      selectedNode.tagName === 'P' ||
      selectedNode.tagName === 'SPAN' ||
      selectedNode.style
    ) {
      selectedNode.style.fontSize = fontSizeSelect.value + 'px';
      selectedNode.style.fontFamily = fontSelect.value;
    } else {
      const span = document.createElement ('span');
      span.style.fontSize = fontSizeSelect.value + 'px';
      span.style.fontFamily = fontSelect.value;
      span.appendChild (range.extractContents ());
      range.insertNode (span);
    }

    window.getSelection ().removeAllRanges ();
  }

  saveHistory ();
}

function updateDropdowns () {
  const selection = window.getSelection ();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt (0);
    const selectedNode = range.startContainer.nodeType === 3
      ? range.startContainer.parentNode
      : range.startContainer;

    if (
      selectedNode.tagName === 'P' ||
      selectedNode.tagName === 'SPAN' ||
      selectedNode.style
    ) {
      const computedStyle = window.getComputedStyle (selectedNode);
      fontSelect.value = computedStyle.fontFamily.replace (/['"]/g, '').trim ();
      fontSizeSelect.value = parseInt (computedStyle.fontSize);
    } else {
      fontSelect.value = 'Arial';
      fontSizeSelect.value = '16';
    }
  }
}

document.addEventListener ('selectionchange', updateDropdowns);

function setTextAlignment (alignment) {
  const selection = window.getSelection ();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt (0);
    const selectedNode = range.startContainer.nodeType === 3
      ? range.startContainer.parentNode
      : range.startContainer;

    if (selectedNode.tagName === 'P') {
      selectedNode.style.textAlign = alignment;
    } else {
      const p = document.createElement ('p');
      p.style.textAlign = alignment;
      p.appendChild (range.extractContents ());
      range.insertNode (p);
    }
    window.getSelection ().removeAllRanges (); // Clear selection
  }

  resetAlignmentButtons ();
  if (alignment === 'left') {
    alignLeft.classList.add ('selected');
  } else if (alignment === 'center') {
    alignCenter.classList.add ('selected');
  } else if (alignment === 'right') {
    alignRight.classList.add ('selected');
  } else if (alignment === 'justify') {
    alignJustify.classList.add ('selected');
  }

  saveHistory (); // Save current state for undo/redo
}

function saveHistory () {
  const currentState = noteDiv.innerHTML;
  if (historyIndex < history.length - 1) {
    history = history.slice (0, historyIndex + 1); // Remove any forward history
  }
  history.push (currentState);
  historyIndex++;
}

boldBtn.addEventListener ('click', function () {
  document.execCommand ('bold');
  updateDropdowns (); // Perbarui dropdowns setelah execCommand
});

italicBtn.addEventListener ('click', function () {
  document.execCommand ('italic');
  updateDropdowns (); // Perbarui dropdowns setelah execCommand
});

underlineBtn.addEventListener ('click', function () {
  document.execCommand ('underline');
  updateDropdowns (); // Perbarui dropdowns setelah execCommand
});

fontSelect.addEventListener ('change', function () {
  updateFontAndSize ();
  updateDropdowns (); // Perbarui dropdowns setelah mengubah font
});

fontSizeSelect.addEventListener ('change', function () {
  updateFontAndSize ();
  updateDropdowns (); // Perbarui dropdowns setelah mengubah ukuran font
});

alignLeft.addEventListener ('click', () => {
  setTextAlignment ('left');
});
alignCenter.addEventListener ('click', () => {
  setTextAlignment ('center');
});
alignRight.addEventListener ('click', () => {
  setTextAlignment ('right');
});
alignJustify.addEventListener ('click', () => {
  setTextAlignment ('justify');
});

document.getElementById ('noteForm').addEventListener ('submit', function (e) {
  e.preventDefault ();
  const title = document.getElementById ('title').value;
  const content = noteDiv.innerHTML; // Save formatted content

  const existingIndex = notes.findIndex (note => note.title === title);
  if (existingIndex !== -1) {
    notes[existingIndex] = {title, content};
  } else {
    notes.push ({title, content});
  }
  localStorage.setItem ('notes', JSON.stringify (notes));

  notesList.innerHTML = '';
  loadNotes ();
  noteDiv.innerHTML = ''; // Clear the content
  document.getElementById ('title').value = '';
  resetAlignmentButtons (); // Reset alignment buttons after saving
});

loadNotes ();
