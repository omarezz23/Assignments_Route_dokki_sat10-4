class User {
 public notebooks: NoteBook[] = [];
  constructor(
    public Id: number,
    public name: string,
    public email: string,
    private Password: string,
    protected Phone: string,
    public age: number,
  ) {
    if (age >= 18 && age <= 60) {
      this.age = age;
    } else {
      throw new Error("the age between 18 and 60");
    }
  }
  public displayInfo(): void {
    console.log("ID:", this.Id);
    console.log("Name:", this.name);
    console.log("Email:", this.email);
    console.log("Password:", this.Password);
    console.log("Phone:", this.Phone);
    console.log("Age:", this.age);
  }

  public addNoteBook(notebook: NoteBook): void {
    this.notebooks.push(notebook);
  }
}

const user1 = new User(
  1,
  "Omar",
  "omar@gmail.com",
  "123456",
  "01012345678",
  22,
);
user1.displayInfo();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Admin extends User {
  constructor(
    Id: number,
    name: string,
    email: string,
    Password: string,
    Phone: string,
    age: number,
  ) {
    super(Id, name, email, Password, Phone, age);
  }

  public manageNotes(): void {
    console.log("Admin can manage notes");
  }
}

const admin1 = new Admin(
  2,
  "Omar",
  "omar@gmail.com",
  "123456",
  "01012345678",
  22,
);

admin1.displayInfo();
admin1.manageNotes();
///////////////////////////////////////////////////////////////////////////////

class Note {
  constructor(
    public Id: number,
    public title: string,
    public content: string,
   public author: User,
  ) {}
  public preview(): string {
    return this.content.substring(0, 30) + "...";
  }
}

const note1 = new Note(
  1,
  "TypeScript",
  "TypeScript is a programming language built on JavaScript.",
  user1,
);
//console.log(note1.preview());
console.log(note1);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class NoteBook {
  private notes: Note[] = [];
  public addNote(title: string, content: string, author: User): void {
    const note = new Note(this.notes.length + 1, title, content, author);
    this.notes.push(note);
  }
  public removeNote(Id: number): void {
    this.notes = this.notes.filter((note) => note.Id !== Id);
  }
  public displayNotes(): void {
    console.log(this.notes);
  }
  public getAllNotes(): Note[] {
    return this.notes;
  }
}

const notebook = new NoteBook();
notebook.addNote("First Note", "Learning TypeScript and OOP", user1);
notebook.addNote("Second Note", "Learning Composition", user1);
notebook.addNote( "third Note", "Learning Generics", user1);
notebook.displayNotes();
notebook.removeNote(2);
notebook.displayNotes();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
console.log(note1.author.name);
/////////////////////////////////////////////////////
console.log("******************************")
const notebook1 = new NoteBook();
const notebook2 = new NoteBook();
user1.addNoteBook(notebook)
user1.addNoteBook(notebook1);
notebook1.addNote("first Note at notbook1", "Learning Composition", user1);
user1.addNoteBook(notebook2);
console.log(user1.notebooks.length);
notebook1.displayNotes()
//////////////////////////////////////////////////////////////////
class Storage<T> {
  private items: T[] = [];

  public addItem(item: T): void {
    this.items.push(item);
  }

  public addItems(items: T[]): void {
    this.items.push(...items);
  }

  public removeItem(item: T): void {
    this.items = this.items.filter(i => i !== item);
  }

  public getAllItems(): T[] {
    return this.items;
  }
}
console.log("******************************")
const storage = new Storage<Note>();

storage.addItems(notebook.getAllNotes());
console.log(storage.getAllItems());
