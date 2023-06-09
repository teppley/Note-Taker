//Require all dependencies

const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Direct user to correct page depending on url

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"))
});
app.get("/notes", (req, res) => {
 res.sendFile(path.join(__dirname, "./public/notes.html"))
});

//Send json of all notes if user accesses /api/notes

app.get("/api/notes", (req, res) => {
fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }
    res.json(JSON.parse(notes))
})
});

//Use POST method to bring user input to backend

app.post("/api/notes", (req, res) => {

  //Declare const for the note currently being saved by user

  const currentNote = req.body;

  //Retrieve notes from db.json, get id of last note, add 1 to it to create 
  //New id, save current note with new id

fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error, notes) => {
    if (error) {
        return console.log(error)
    }
    notes = JSON.parse(notes)

    //Assign unique id to each new note depending on last id.
    //If no items in notes array, assign id as 10

    if (notes.length > 0) {
    let lastId = notes[notes.length - 1].id
    var id =  parseInt(lastId)+ 1
    } else {
      var id = 10;
    }

    //Create new note object

    let newNote = { 
      title: currentNote.title, 
      text: currentNote.text, 
      id: id 
      }

    //Merge new note with existing notes array

    var newNotesArr = notes.concat(newNote)

    //Write new array to db.json file and return it to user

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(newNotesArr), (error, data) => {
      if (error) {
        return error
      }
      console.log(newNotesArr)
      res.json(newNotesArr);
    })
  });
});

//Delete chosen note using delete http method

app.delete("/api/notes/:id", (req, res) => {
  let deleteId = JSON.parse(req.params.id);
  console.log("ID to be deleted: " ,deleteId);
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (error,notes) => {
    if (error) {
        return console.log(error)
    }
   let notesArray = JSON.parse(notes);

   //Loop through notes array and remove note with id matching deleteId

   for (var i=0; i<notesArray.length; i++){
     if(deleteId == notesArray[i].id) {
       notesArray.splice(i,1);

       fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (error, data) => {
        if (error) {
          return error
        }
        console.log(notesArray)
        res.json(notesArray);
      })
     }
  }
  
}); 
});

//Initialize port 

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));