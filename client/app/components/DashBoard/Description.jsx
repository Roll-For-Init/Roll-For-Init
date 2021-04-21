import React from 'react';
import Masonry from 'react-masonry-css';
import ReactReadMoreReadLess from 'react-read-more-read-less';

const Description = ({character}) => {

  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace('./', '')] = r(item);
    });
    return images;
  }

  const raceSilhouettes = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/race',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesSlimShort = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/slim-short',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesSlimTall = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/slim-tall',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesWideShort = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/wide-short',
      false,
      /\.(png)$/
    )
  );

  const classSilhouettesWideTall = importAll(
    require.context(
      '../../../public/assets/imgs/silhouettes/class/wide-tall',
      false,
      /\.(png)$/
    )
  );

  const buildDictionary = [
    { name: 'dragonborn', build: 'wide-tall' },
    { name: 'dwarf', build: 'wide-short' },
    { name: 'elf', build: 'slim-tall' },
    { name: 'gnome', build: 'slim-short' },
    { name: 'half-elf', build: 'slim-tall' },
    { name: 'half-orc', build: 'wide-tall' },
    { name: 'halfling', build: 'slim-short' },
    { name: 'human', build: 'slim-tall' },
    { name: 'tiefling', build: 'slim-tall' },
  ];

  const findBuild = raceName => {
    console.log(raceName);
    return buildDictionary.find(dictEntry => dictEntry.name === raceName).build;
  };

  function getBuildImage(raceName, className) {
    let buildImage;
    const build = findBuild(raceName);

    if (build === 'slim-tall') {
      buildImage = classSilhouettesSlimTall[`${className}.png`];
    } else if (build === 'slim-short') {
      buildImage = classSilhouettesSlimShort[`${className}.png`];
    } else if (build === 'wide-tall') {
      buildImage = classSilhouettesWideTall[`${className}.png`];
    } else if (build === 'wide-short') {
      buildImage = classSilhouettesWideShort[`${className}.png`];
    }
    return buildImage;
  }

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };


  return (
    <div className="description-container">
      <div className="translucent-card w-100 row">
          <div className="silhouette-container d-none d-md-flex col-auto">
            {character.portrait.image === null ? (
              <>
            <img
              src={raceSilhouettes[`${character.race.name.toLowerCase().replace(/ $/, '-')}.png`]}
            />
            <img
              src={getBuildImage(
                character.race.name.toLowerCase().replace(/ $/, '-'),
                character.class[0].name.toLowerCase().replace(/ $/, '-')
              )}
            /></>)
            : (<img src={character.portrait.image}/>)}
          </div>
          <div className="col">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            
            {[(<div className="card content-card description-card">
              <p>
                <span className="description-label">Size: </span>
                {character.size}
              </p>
              {["age", "weight", "height", "eyes", "skin", "hair"].map((key) => {
                return (
                  character.physical_description[key] &&
                  <p>
                    <span className="description-label">{key}: </span>
                    {character.physical_description[key]}
                  </p>
                );
              })}
              {character.lore.alignment && character.lore.alignment[0] &&
                <p>
                  <span className="description-label">Alignment: </span>
                  {character.lore.alignment[0].name}
                </p>
              }
              {character.background.name && !character.background.description &&
                <p>
                  <span className="description-label">Background: </span>
                  {character.background.name}
              </p>
              }
            </div>),
            ...[character.background.description ?
              <div className="card content-card description-card lore-card">
                <h6 className="description-label">Background{character.background.name && (": " + character.background.name)}</h6>
                  <p>
                  <ReactReadMoreReadLess
                    charLimit={250}
                    readMoreText="Show more"
                    readLessText="Show less"
                    readMoreClassName="read-more-less--more"
                    readLessClassName="read-more-less--less"
                  >
                    {Array.isArray(character.background.description) ? character.background.description.join("\n") : character.background.description}
                  </ReactReadMoreReadLess>
                  </p>
              </div>
              :
              null
             ] || [],
            ...(
              ["personality_traits", "ideals", "bonds", "flaws", "backstory", "relationships"].map((key) => {
                return (character.lore[key] &&
                  <div className="card content-card description-card lore-card">
                    <h6 className="description-label">{key.replace('_', ' ')}</h6>
                    <p>{character.lore[key]}</p>
                  </div>
                );
              })
            )]}
          </Masonry>
        </div>
      </div>
    </div>

    
  );
}

export default Description;
