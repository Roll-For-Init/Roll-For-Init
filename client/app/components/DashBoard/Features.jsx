import React from 'react';
import ReactReadMoreReadLess from 'react-read-more-read-less';
import Masonry from 'react-masonry-css';
import { setUpdate, setArrayUpdate} from '../../redux/actions/characters';

import { Star } from '../../utils/svgLibrary';
import { useDispatch } from 'react-redux';

// const character = useSelector(state => state.characters[charID]);

const Features = ({charID, features, traits}) => {

  const breakpointColumnsObj = {
    default: 4,
    991: 3,
    767: 2,
    575: 1,
  };

  const dispatch = useDispatch();

  const togglePinned = (type, idx) => {
    if (type === 'feature') {
      features[idx].pinned = !features[idx].pinned;
      dispatch(setArrayUpdate(charID, 'features', features));
    }
    else {
      traits[idx].pinned = !traits[idx].pinned;
      dispatch(setArrayUpdate(charID, 'traits', traits));
    }
  }

  return (
    <div className="row features-container">
      <div className="translucent-card w-100">
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {features.map((f, index) => {
              return f.name ? (<FeatureCard feature={f} togglePinned={() => {togglePinned('feature', index)}}/>) : <></>;
            }).concat(traits.map((f, index) => {
              return f.name ? (<FeatureCard feature={f} togglePinned={() => {togglePinned('trait', index)}}/>) : <></>;
            }))}
        </Masonry>
      </div>
    </div>
  );


};

const FeatureCard = ({feature, togglePinned}) => {
  console.log("feature", feature);

  return (
    <div className="card content-card feature-card">
      <h5>
        {!feature.pinned ?
          <button className='wrapper-button' onClick={() => {togglePinned()}}><Star className="star-outline"/></button>
          :
          <button className='wrapper-button' onClick={() => {togglePinned()}}><Star className="star-filled"/></button>
        }
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
}

export default Features;