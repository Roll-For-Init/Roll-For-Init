import React from "react";
import { connect } from "react-redux";
import { getBackgroundInfo } from "../../actions";

export const Background = props => {
  const { backgrounds } = props.backgrounds;

  const test = [
    {
      name: "acolyte",
      proficiencies: {
        skills: ["Askill1", "Askill2"],
        languages: ["Alanguage1", "alanguage2"]
      },
      feature: {
        name: "shelter of the faithful",
        description: "la la la la la"
      }
    },
    {
      name: "brawler",
      proficiencies: {
        skills: ["Bskill1", "Bskill2"],
        languages: ["Blanguage1", "Blanguage2"]
      },
      feature: {
        name: "fists of the pugilist",
        description: "pow pow"
      }
    }
  ];

  const selectBackground = background => {
    props.selectBackground(background);
  };

  const handleChange = e => {
    console.log(e.target.value);
  };

  return (
    <div className="background">
      <h2 className="p-4" style={{ position: "sticky", top: -50, zIndex: 99 }}>
        Background
      </h2>
      <div className="card content-card background-card shadow-card">
        Choose a preset background, or create your own. Your background reveals
        where you came from. how you became an adventurer, and your place in the
        world. If you create a custom background, work with your GM to build one
        that makes sense for your character.
      </div>
      <div className="card translucent-card">
        <select
          className="card dropdown-card"
          aria-label="Background selection"
          onChange={e => console.log(e.target.value)}
        >
          {test.map((background, idx) => (
            <option key={idx} value={background.name}>
              {background.name}
            </option>
          ))}
        </select>
        <div className="card content-card description-card shadow-card">
          As an acolyte...
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card title-card">Proficiencies</div>
        <div className="skill-container">
          <div className="card content-card skill-card">Skill 1</div>
          <div className="card content-card skill-card">Skill 2</div>
        </div>
        <div className="card content-card language-card">
          Choose a Tool or Language
        </div>
        <div className="card content-card language-card mb-0">
          Choose a Tool or Language
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card title-card">Background Feature</div>
        <div className="card content-card subtitle-card">
          Shelter of the Faithful
        </div>
        <div className="card content-card description-card shadow-card">
          As an acolyte...
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5"
        style={{ position: "sticky", bottom: 10 }}
        onClick={() => props.setPage({ index: 3, name: "abilities" })}
      >
        OK
      </button>
    </div>
  );
};

const mapStateToProps = state => ({
  backgrounds: state.createCharacter
});

const mapDispatchToProps = dispatch => ({
  selectBackground: background => dispatch(getBackgroundInfo(background))
});

export default connect(mapStateToProps, mapDispatchToProps)(Background);
