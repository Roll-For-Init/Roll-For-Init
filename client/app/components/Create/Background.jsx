import React, { useState } from "react";
import { connect } from "react-redux";
import { getBackgroundInfo } from "../../actions";
import ReactReadMoreReadLess from "react-read-more-read-less";
import Dropdown from "../Dropdown";

export const Background = props => {
  const { backgrounds } = props.backgrounds;

  const selectBackground = background => {
    props.selectBackground(background);
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
        <Dropdown
          title={backgrounds[0].name}
          items={[...backgrounds, { index: "custom", name: "Custom" }]}
          width="70%"
          header
        />
        {backgrounds[0].index === "custom" && (
          <div className="card content-card subtitle-card">
            <form>
              <input type="text" name="backgroundName" />
            </form>
          </div>
        )}

        <div className="card content-card description-card shadow-card mb-0">
          {backgrounds[0].index === "custom" ? (
            <form>
              <input type="text" name="backgroundDesc" />
            </form>
          ) : (
            <ReactReadMoreReadLess
              charLimit={250}
              readMoreText="Show more"
              readLessText="Show less"
              readMoreClassName="read-more-less--more"
              readLessClassName="read-more-less--less"
            >
              {backgrounds[0].desc}
            </ReactReadMoreReadLess>
          )}
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card title-card pb-0">
          <h5>Proficiencies</h5>
        </div>
        <div className="skill-container">
          {backgrounds[0].index === "custom" ? (
            <Dropdown title="Choose a Skill" items={[]} width="50%" />
          ) : (
            <div className="card content-card skill-card">
              {backgrounds[0].starting_proficiencies[0].name}
            </div>
          )}
          {backgrounds[0].index === "custom" ? (
            <Dropdown title="Choose a Skill" items={[]} width="50%" />
          ) : (
            <div className="card content-card skill-card">
              {backgrounds[0].starting_proficiencies[1].name}
            </div>
          )}
        </div>
        <Dropdown
          title={`Choose ${backgrounds[0].language_options.choose}: ${backgrounds[0].language_options.type}`}
          items={backgrounds[0].language_options.from.map(language => language)}
          width="50%"
          multiSelect
        />
        <div className="card content-card language-card">Choose a Tool</div>
        <div className="card content-card language-card mb-0">
          Choose a Tool
        </div>
      </div>
      <div className="card translucent-card">
        <div className="card content-card title-card pb-0">
          <h5>Background Feature</h5>
        </div>
        {backgrounds[0].name === "Custom" && (
          <div className="card content-card description-card shadow-card">
            Background features are normally soft skills that can help you
            outside of combat. Background features can help you with social
            interactions, give you knowledge about a certain topic, or give you
            resources to otherwise give you an upper hand in specific
            situations. If you create a custom feature, work with your GM to
            ensure it makes sense for your character.
          </div>
        )}
        <div className="card content-card subtitle-card">
          {backgrounds[0].name === "Custom" ? (
            <form>
              <input type="text" name="featName" />
            </form>
          ) : (
            backgrounds[0].feature.name
          )}
        </div>
        <div className="card content-card description-card shadow-card mb-0">
          {backgrounds[0].name === "Custom" ? (
            <form>
              <input type="text" name="featDesc" />
            </form>
          ) : (
            <ReactReadMoreReadLess
              charLimit={240}
              readMoreText="Show more"
              readLessText="Show less"
              readMoreClassName="read-more-less--more"
              readLessClassName="read-more-less--less"
            >
              {backgrounds[0].feature.desc[0]}
            </ReactReadMoreReadLess>
          )}
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
