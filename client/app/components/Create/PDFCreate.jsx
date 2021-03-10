import React from 'react';
import { jsPDF } from "jspdf";

function formatPayload (Name, Race, Class, Background, Abilities, Descriptions, Equipment){
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
  return (
    <form>
    <div class="centered">
    <div>
        <label class="label">Name</label>
        <input class="input" type="Name" name="Name"  />
    </div>
    <div>
        <label class="label">Race</label>
        <input class="input" type="Race" name="Race"  />
    </div>
    <div>
        <label class="label">Class</label>
        <input class="input" type="Class" name="Class"  />
    </div>
    <div>
    <label class="label">Background</label>
        <input class="input" type="Background" name="Background"  />
    </div>
    <label class="label">Abilities</label>
        <input class="input" type="Abilities" name="Abilities"  />
    <div>
    <label class="label">Description</label>
        <input class="input" type="Description" name="Description"  />
    </div>
    <div>
    <label class="label">Equipment</label>
        <input class="input" type="Equipment" name="Equipment"  />
    </div>
    </div>

  </form>
  )
};

export default PDFCreate;
