import React, { useState } from "react";
import { connect } from "react-redux";
import { getBackgroundInfo } from "../../actions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Dropdown from "../shared/Dropdown";

export const Background = props => {
  const { backgrounds } = props.backgrounds;

  const selectBackground = background => {
    props.selectBackground(background);
  };

  const [selectionBg, setSelectionBg] = useState([backgrounds[0]]);
  const [selectionSk1, setSelectionSk1] = useState([]);
  const [selectionSk2, setSelectionSk2] = useState([]);
  const [selectionLang, setSelectionLang] = useState([
    backgrounds[0].language_options.from[0]
  ]);
  const [selectionTlLg1, setSelectionTlLg1] = useState([]);
  const [selectionTlLg2, setSelectionTlLg2] = useState([]);

  return (
    <div className="background">
      <h2 className="title-card p-4">
        Background
      </h2>
      <div className="card content-card description-card shadow-card">
        Choose a preset background, or create your own. Your background reveals
        where you came from. how you became an adventurer, and your place in the
        world. If you create a custom background, work with your GM to build one
        that makes sense for your character.
      </div>
      <div className="card translucent-card">
        <Dropdown
          title={backgrounds[0].name}
          items={[...backgrounds, { index: "custom", name: "Custom" }]}
          width="70%"
          header
          selection={selectionBg}
          setSelection={setSelectionBg}
        />
        {selectionBg[0].index === "custom" && (
          <div className="card content-card card-subtitle">
            <form style={{ padding: "0px 5px" }}>
              <input
                className="p-0 m-0"
                style={{ border: "none", width: "100%" }}
                type="text"
                name="backgroundName"
                placeholder="Background Name"
              />
            </form>
          </div>
        )}
        <div className="card content-card description-card shadow-card mb-0">
          {selectionBg[0].index === "custom" ? (
            <form>
              <textarea
                className="p-0 m-0"
                style={{
                  background: "#f2e9d9",
                  border: "none",
                  width: "100%"
                }}
                type="text"
                name="backgroundDesc"
                placeholder="Background Description (optional)"
              />
            </form>
          ) : (
            <ReactReadMoreReadLess
              charLimit={250}
              readMoreText="Show more"
              readLessText="Show less"
              readMoreClassName="read-more-less--more"
              readLessClassName="read-more-less--less"
            >
              {selectionBg[0].desc}
            </ReactReadMoreReadLess>
          )}
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title pb-0">
          <h5>Proficiencies</h5>
        </div>
        <div className="skill-container">
          {selectionBg[0].index === "custom" ? (
            <Dropdown
              title="Choose a Skill"
              items={[]}
              width="50%"
              selection={selectionSk1}
              setSelection={setSelectionSk1}
            />
          ) : (
            <div className="card content-card skill-card">
              {selectionBg[0].starting_proficiencies[0].name}
            </div>
          )}
          {selectionBg[0].index === "custom" ? (
            <Dropdown
              title="Choose a Skill"
              items={[]}
              width="50%"
              selection={selectionSk2}
              setSelection={setSelectionSk2}
            />
          ) : (
            <div className="card content-card skill-card">
              {selectionBg[0].starting_proficiencies[1].name}
            </div>
          )}
        </div>
        {selectionBg[0].index === "custom" ? (
          <>
            <Dropdown
              title="Choose a Tool or Language"
              items={[]}
              width="50%"
              selection={selectionTlLg1}
              setSelection={setSelectionTlLg1}
            />
            <Dropdown
              title="Choose a Tool or Language"
              items={[]}
              width="50%"
              selection={selectionTlLg2}
              setSelection={setSelectionTlLg2}
            />
          </>
        ) : (
          <Dropdown
            title={`Choose ${selectionBg[0].language_options.choose}: ${selectionBg[0].language_options.type}`}
            items={selectionBg[0].language_options.from}
            selectLimit={selectionBg[0].language_options.choose}
            width="50%"
            multiSelect
            selection={selectionLang}
            setSelection={setSelectionLang}
          />
        )}
      </div>
      <div className="card translucent-card">
        <div className="card content-card card-title pb-0">
          <h5>Background Feature</h5>
        </div>
        {selectionBg[0].name === "Custom" && (
          <div className="card content-card description-card shadow-card">
            Background features are normally soft skills that can help you
            outside of combat. Background features can help you with social
            interactions, give you knowledge about a certain topic, or give you
            resources to otherwise give you an upper hand in specific
            situations. If you create a custom feature, work with your GM to
            ensure it makes sense for your character.
          </div>
        )}
        <div className="card content-card card-subtitle">
          {selectionBg[0].name === "Custom" ? (
            <form style={{ padding: "0px 5px" }}>
              <input
                className="p-0 m-0"
                style={{ border: "none", width: "100%" }}
                type="text"
                name="featName"
                placeholder="Feature Name"
              />
            </form>
          ) : (
            selectionBg[0].feature.name
          )}
        </div>
        <div className="card content-card description-card shadow-card mb-0">
          {selectionBg[0].name === "Custom" ? (
            <form>
              <textarea
                style={{
                  background: "#f2e9d9",
                  border: "none",
                  width: "100%"
                }}
                type="text"
                name="featDesc"
                placeholder="Feature Description"
              />
            </form>
          ) : (
            <ReactReadMoreReadLess
              charLimit={240}
              readMoreText="Show more"
              readLessText="Show less"
              readMoreClassName="read-more-less--more"
              readLessClassName="read-more-less--less"
            >
              {selectionBg[0].feature.desc[0]}
            </ReactReadMoreReadLess>
          )}
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5"
        style={{ position: "sticky", bottom: 10 }}
        onClick={() => props.setPage({ index: 3, name: "Abilities" })}
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
