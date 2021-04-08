import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';


const formatPayload = (Name, Race, Class, Background, Abilities, Descriptions, Equipment) => {
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
}



export const PDFCreate = () => {
    const [N, setN] = useState();
    const [R, setR] = useState();
    const [C, setC] = useState();
    const [B, setB] = useState();
    const [A, setA] = useState();
    const [D, setD] = useState();
    const [E, setE] = useState();

    const onClick = async() => {
          axios.post('api/pdf/pdfGen', formatPayload(N, R, C, B, A, D, E), {responseType: 'blob'}).then(response => {
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
        return false;
    } 

  return (
    <form>
    <div class="centered">
    <div>
        <label class="label">Name</label>
        <input class="input" type="Name" defaultValue=" " name="Name" value={N}  onChange={e => setN(e.target.value)} />
    </div>
    <div>
        <label class="label">Race</label>
        <input class="input" type="Race" defaultValue=" " name="Race" value={R} onChange={e => setR(e.target.value)} />
    </div>
    <div>
        <label class="label">Class</label>
        <input class="input" type="Class" defaultValue=" " name="Class" value={C} onChange={e => setC(e.target.value)} />
    </div>
    <div>
    <label class="label">Background</label>
        <input class="input" type="Background" defaultValue=" " name="Background" value={B} onChange={e => setB(e.target.value)} />
    </div>
    <label class="label">Abilities</label>
        <input class="input" type="Abilities" defaultValue=" " name="Abilities" value={A} onChange={e => setA(e.target.value)}/>
    <div>
    <label class="label">Description</label>
        <input class="input" type="Description" defaultValue=" " name="Description" value={D} onChange={e => setD(e.target.value)}  />
    </div>
    <div>
    <label class="label">Equipment</label>
        <input class="input" type="Equipment" defaultValue=" " name="Equipment" value={E} onChange={e => setE(e.target.value)} />
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
