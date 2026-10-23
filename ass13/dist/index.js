class User {
    Id;
    name;
    email;
    Password;
    Phone;
    age;
    notebooks = [];
    constructor(Id, name, email, Password, Phone, age) {
        this.Id = Id;
        this.name = name;
        this.email = email;
        this.Password = Password;
        this.Phone = Phone;
        this.age = age;
        if (age >= 18 && age <= 60) {
            this.age = age;
        }
        else {
            throw new Error("the age between 18 and 60");
        }
    }
    displayInfo() {
        console.log("ID:", this.Id);
        console.log("Name:", this.name);
        console.log("Email:", this.email);
        console.log("Password:", this.Password);
        console.log("Phone:", this.Phone);
        console.log("Age:", this.age);
    }
    addNoteBook(notebook) {
        this.notebooks.push(notebook);
    }
}
const user1 = new User(1, "Omar", "omar@gmail.com", "123456", "01012345678", 22);
user1.displayInfo();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Admin extends User {
    constructor(Id, name, email, Password, Phone, age) {
        super(Id, name, email, Password, Phone, age);
    }
    manageNotes() {
        console.log("Admin can manage notes");
    }
}
const admin1 = new Admin(2, "Omar", "omar@gmail.com", "123456", "01012345678", 22);
admin1.displayInfo();
admin1.manageNotes();
///////////////////////////////////////////////////////////////////////////////
class Note {
    Id;
    title;
    content;
    author;
    constructor(Id, title, content, author) {
        this.Id = Id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    preview() {
        return this.content.substring(0, 30) + "...";
    }
}
const note1 = new Note(1, "TypeScript", "TypeScript is a programming language built on JavaScript.", user1);
//console.log(note1.preview());
console.log(note1);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class NoteBook {
    notes = [];
    addNote(title, content, author) {
        const note = new Note(this.notes.length + 1, title, content, author);
        this.notes.push(note);
    }
    removeNote(Id) {
        this.notes = this.notes.filter((note) => note.Id !== Id);
    }
    displayNotes() {
        console.log(this.notes);
    }
    getAllNotes() {
        return this.notes;
    }
}
const notebook = new NoteBook();
notebook.addNote("First Note", "Learning TypeScript and OOP", user1);
notebook.addNote("Second Note", "Learning Composition", user1);
notebook.addNote("third Note", "Learning Generics", user1);
notebook.displayNotes();
notebook.removeNote(2);
notebook.displayNotes();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log(note1.author.name);
/////////////////////////////////////////////////////
console.log("******************************");
const notebook1 = new NoteBook();
const notebook2 = new NoteBook();
user1.addNoteBook(notebook);
user1.addNoteBook(notebook1);
notebook1.addNote("first Note at notbook1", "Learning Composition", user1);
user1.addNoteBook(notebook2);
console.log(user1.notebooks.length);
notebook1.displayNotes();
//////////////////////////////////////////////////////////////////
class Storage {
    items = [];
    addItem(item) {
        this.items.push(item);
    }
    addItems(items) {
        this.items.push(...items);
    }
    removeItem(item) {
        this.items = this.items.filter(i => i !== item);
    }
    getAllItems() {
        return this.items;
    }
}
console.log("******************************");
const storage = new Storage();
storage.addItems(notebook.getAllNotes());
console.log(storage.getAllItems());
export {};
//# sourceMappingURL=index.js.map