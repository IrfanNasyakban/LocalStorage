document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        tambahBuku();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function tambahBuku() {
    const judul = document.getElementById('judul').value;
    const penulis = document.getElementById('penulis').value;
    const tanggal = document.getElementById('tanggal').value;

    const generatedID = generateId();
    const objekBuku = generateObjekBuku(generatedID, judul, penulis, tanggal, false);
    books.push(objekBuku);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateObjekBuku(id, judul, penulis, tanggal, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tanggal,
        isCompleted
    }
}

const books = [];
const RENDER_EVENT = 'render-buku';

document.addEventListener(RENDER_EVENT, function () {

    const belumSelesai = document.getElementById('books');
    belumSelesai.innerHTML = '';

    const selesai = document.getElementById('completed-books');
    selesai.innerHTML = '';

    for (const itemBuku of books) {
        const elemenBuku = buatBuku(itemBuku);
        if (itemBuku.isCompleted) {
            selesai.append(elemenBuku);
        } else
            belumSelesai.append(elemenBuku);
    }
});

function buatBuku(objekBuku) {
    const textJudul = document.createElement('h2');
    textJudul.innerText = objekBuku.judul;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = 'Penulis: ' + objekBuku.penulis;

    const textTanggal = document.createElement('p');
    textTanggal.innerText = 'Tanggal Terbit: ' + objekBuku.tanggal;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textJudul, textPenulis, textTanggal);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `buku-${objekBuku.id}`);

    if (objekBuku.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(objekBuku.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(objekBuku.id);
        });

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(objekBuku.id);
        });



        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        checkButton.addEventListener('click', function () {
            addBookToCompleted(objekBuku.id);
        });

        trashButton.addEventListener('click', function () {
            removeBookFromCompleted(objekBuku.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

function addBookToCompleted(idBuku) {
    const targetBuku = menemukanBuku(idBuku);

    if (targetBuku == null) return;

    targetBuku.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function menemukanBuku(idBuku) {
    for (const itemBuku of books) {
        if (itemBuku.id === idBuku) {
            return itemBuku;
        }
    }
    return null;
}

function removeBookFromCompleted(idBuku) {
    const targetBuku = menemukanBukuIndex(idBuku);

    if (targetBuku === -1) return;

    books.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function undoBookFromCompleted(idBuku) {
    const targetBuku = menemukanBuku(idBuku);

    if (targetBuku == null) return;

    targetBuku.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function menemukanBukuIndex(idBuku) {
    for (const index in books) {
        if (books[index].id === idBuku) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'SIMPAN-BUKU';
const STORAGE_KEY = 'BOOKS_APPS';

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
            books.push(buku);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}