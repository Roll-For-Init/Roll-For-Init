import React from 'react';
const { jsPDF } = require("jspdf");



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

const onClick = () => {
    var x = [this.refs.Name.value, this.refs.Race.value, this.refs.Background.value, this.refs.Abilities.value, this.refs.Description.value, this.refs.Equipment.value];
    const doc = new jsPDF();
    doc.text(x, 10, 10);
    doc.save("a4.pdf"); // will save the file in the current working directory
} 

export const PDFCreate = () => {
  return (
    <form>
    <div class="centered">
    <div>
        <label class="label">Name</label>
        <input class="input" ref="Name" name="Name"  />
    </div>
    <div>
        <label class="label">Race</label>
        <input class="input" ref="Race" name="Race"  />
    </div>
    <div>
        <label class="label">Class</label>
        <input class="input" ref="Class" name="Class"  />
    </div>
    <div>
    <label class="label">Background</label>
        <input class="input" ref="Background" name="Background"  />
    </div>
    <label class="label">Abilities</label>
        <input class="input" ref="Abilities" name="Abilities"  />
    <div>
    <label class="label">Description</label>
        <input class="input" ref="Description" name="Description"  />
    </div>
    <div>
    <label class="label">Equipment</label>
        <input class="input" ref="Equipment" name="Equipment"  />
    </div>
    <div>
    <button onClick={onClick}>
        Submit
    </button>
    </div>
    </div>

  </form>
  )
};

export default PDFCreate;
