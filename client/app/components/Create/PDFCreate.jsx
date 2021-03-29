import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import axios from 'axios';
//const { jsPDF } = require("jspdf");
import FileSaver from 'file-saver';



//const templateID = "5jfMxXvdy67BJPIMNg0o"
//const apiKey = "SxReYSrsBCxyO11FSPnR2ZDnNKmo0lNV"
//const anvil = new Anvil({apiKey})

/*const formatPayload = (Name, Race, Class, Background, Abilities, Descriptions, Equipment) => {
    var payload = {
        "title": "Character Sheet Demo",
        "fontSize": 10,
        "textColor": "#333333",
        "data": {
          "Name": Name,
          "Class": Class,
          "Background": Background,
          "Race": Race,
          "Abilities": Abilities,
          "Description": Descriptions,
          "Equipment": Equipment
        }
      }
      return payload;
}*/



export const PDFCreate = () => {
    const [N, setN] = useState();
    const [R, setR] = useState();
    const [C, setC] = useState();
    const [B, setB] = useState();
    const [A, setA] = useState();
    const [D, setD] = useState();
    const [E, setE] = useState();

    const onClick = async() => {
         await axios.get('api/pdf/pdfGen', {
            responseType: "blob"
          }).then(response => {
            //Create a Blob from the PDF Stream
            const file = new Blob([response.data], {
              type: "application/pdf"
            });
            //Build a URL from the file
            const fileURL = URL.createObjectURL(file);
            //Open the URL on new Window
            window.open(fileURL);
          })
          .catch(error => {
            console.log(error);
          });

        /*const doc = new jsPDF();
        doc.text("Name: "+ N, 10, 10);
        doc.text("Race: "+ R, 10, 20);
        doc.text("Class: "+ C, 10, 30);
        doc.text("Background: "+ B, 10, 40);
        doc.text("Abiltiies: "+ A, 10, 50);
        doc.text("Description: "+ D, 10, 60);
        doc.text("Equipment: "+ E, 10, 70);
        doc.save("PDFTest.pdf"); // will save the file in the current working directory*/
        return false;
    } 

  return (
    <form>
    <div class="centered">
    <div>
        <label class="label">Name</label>
        <input class="input" type="Name" name="Name" value={N}  onChange={e => setN(e.target.value)} />
    </div>
    <div>
        <label class="label">Race</label>
        <input class="input" type="Race" name="Race" value={R} onChange={e => setR(e.target.value)} />
    </div>
    <div>
        <label class="label">Class</label>
        <input class="input" type="Class" name="Class" value={C} onChange={e => setC(e.target.value)} />
    </div>
    <div>
    <label class="label">Background</label>
        <input class="input" type="Background" name="Background" value={B} onChange={e => setB(e.target.value)} />
    </div>
    <label class="label">Abilities</label>
        <input class="input" type="Abilities" name="Abilities" value={A} onChange={e => setA(e.target.value)}/>
    <div>
    <label class="label">Description</label>
        <input class="input" type="Description" name="Description" value={D} onChange={e => setD(e.target.value)}  />
    </div>
    <div>
    <label class="label">Equipment</label>
        <input class="input" type="Equipment" name="Equipment" value={E} onChange={e => setE(e.target.value)} />
    </div>
    <div>
    <button type="button" onClick={onClick}>
        Submit
    </button>
    </div>
    </div>

  </form>
  )
};

export default PDFCreate;
