import React, { useState } from 'react';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import { setUpdate, setArrayUpdate } from '../../redux/actions/characters';

import { Star } from '../../utils/svgLibrary';
import { useDispatch } from 'react-redux';

// const character = useSelector(state => state.characters[charID]);

export const Features = ({charID, features, traits}) => {

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };

  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState();

  const togglePinned = (type, idx) => {
    if (type === 'feature') {
      features[idx].pinned = !features[idx].pinned;
      dispatch(setArrayUpdate(charID, 'features', features));
    } else {
      traits[idx].pinned = !traits[idx].pinned;
      dispatch(setArrayUpdate(charID, 'traits', traits));
    }
  };

  const searchHandleChange = event => {
    setSearchTerm(event.target.value);
  };

  const cards = () => {
    return !searchTerm ?
      features.map((f, idx) => {return {...f, index: idx}})
        .filter((f) => {return f.name})
        .map((f) => {
          return f.name ? (<FeatureCard feature={f} togglePinned={() => {togglePinned('feature', f.index)}}/>) : <></>;
        })
      .concat(traits.map((t, idx) => {return {...t, index: idx}})
        .filter((t) => {return t.name})
        .map((t) => {
          return t.name ? (<FeatureCard feature={t} togglePinned={() => {togglePinned('trait', t.index)}}/>) : <></>;
      }))
    :
      features.map((f, idx) => {return {...f, index: idx}})
        .filter((f) => {return f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase())})
        .map((f) => {
          return f.name ? (<FeatureCard feature={f} togglePinned={() => {togglePinned('feature', f.index)}}/>) : <></>;
        })
      .concat(traits.map((t, idx) => {return {...t, index: idx}})
        .filter((t) => {return t.name && t.name.toLowerCase().includes(searchTerm.toLowerCase())})
        .map((t) => {
          return t.name ? (<FeatureCard feature={t} togglePinned={() => {togglePinned('trait', t.index)}}/>) : <></>;
      }));
  }

  return (
    <div className="features-container">
      <div className="row search-container">
        <h4 className="search-bar">
          <i className="bi bi-search" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={searchHandleChange}
          ></input>
        </h4>
      </div>
      <div className="row">
        <div className="translucent-card w-100">
          {cards().length ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {cards()}
            </Masonry>
          )
          : (
            <h4 class="pb-2">No results found</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard = ({feature, togglePinned}) => {
  return (
    <div className="card content-card feature-card">
      <h5>
        {!feature.pinned ? (
          <button
            className="wrapper-button"
            onClick={() => {
              togglePinned();
            }}
          >
            <Star className="star-outline" />
          </button>
        ) : (
          <button
            className="wrapper-button"
            onClick={() => {
              togglePinned();
            }}
          >
            <Star className="star-filled" />
          </button>
        )}
        {feature.name}
      </h5>
      <hr />
      <p>
        <ReactReadMoreReadLess
          charLimit={250}
          readMoreText="Show more"
          readLessText="Show less"
          readMoreClassName="read-more-less--more"
          readLessClassName="read-more-less--less"
        >
          {feature.desc.join('\n')}
        </ReactReadMoreReadLess>
      </p>
    </div>
  );
};

export default Features;
