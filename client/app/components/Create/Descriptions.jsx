import React, { useState, useEffect, useReducer } from 'react';
//import { getDescriptionInfo } from '../../actions';
import FloatingLabel from 'floating-label-react';
import { Form, Field } from 'react-final-form';
import Dropdown from '../shared/Dropdown';
import charPlaceholder from '../../../public/assets/imgs/char-placeholder.png';
import Dropzone from 'react-dropzone';
import CharacterService from '../../redux/services/character.service';
import { useSelector, useDispatch } from 'react-redux';
import { setDescription } from '../../redux/actions';
import ReactReadMoreReadLess from 'react-read-more-read-less';

export const Descriptions = ({ charID, setPage }) => {
  const dispatch = useDispatch();

  const [alignments, setAlignments] = useState([]);

  const race = useSelector(state => state.characters[charID].race);

  //   const selectDescription = description => {
  //     dispatch(setDescription(charID, description[0]));
  //     if (background[0].index == 'custom') {
  //       setSelectionBg(background);
  //     } else {
  //       CharacterService.getBackgroundInfo(description[0])
  //         .then(bg => {
  //           setSelectionBg([bg]);
  //           console.log(bg);
  //           return bg;
  //         })
  //         .then(bg => {
  //           let equipment = { equipment: bg.starting_equipment };
  //           dispatch(setDescription(charID, equipment));
  //           dispatch(setDescription(charID, { proficiencies: bg.proficiencies }));
  //           let personality = {
  //             traits: bg.personality_traits,
  //             ideals: bg.ideals,
  //             bonds: bg.bonds,
  //             flaws: bg.flaws,
  //           };
  //           dispatch(setDescription(charID, { description: personality }));
  //         });
  //     }
  //   };

  const reducer = (state, newProp) => {
    let newState = { ...state, ...newProp };
    dispatch(setDescription(charID, { choices: newState }));
    return newState;
  };

  useEffect(() => {
    CharacterService.getIndexedList('alignments').then(list => {
      setAlignments(list);
    });
    console.log(race);
  }, []);

  const [userChoices, setUserChoices] = useReducer(reducer, {});
  const [personality, setPersonality] = useState('');
  const [ideals, setIdeals] = useState('');
  const [bonds, setBonds] = useState('');
  const [flaws, setFlaws] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [eyes, setEyes] = useState('');
  const [skin, setSkin] = useState('');
  const [hair, setHair] = useState('');
  const [backstory, setBackstory] = useState('');
  const [relationships, setRelationships] = useState('');

  const maxImageSize = 10000000; // bytes
  const acceptedFileTypes =
    'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
  const characterLimit = 45;
  const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
    return item.trim();
  });

  const [selectionAl, setSelectionAl] = useState(null);
  const [charPort, setCharPort] = useState(charPlaceholder);
  const [fileName, setFileName] = useState('No file chosen');
  const [errors, setErrors] = useState('');

  const verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > maxImageSize) {
        console.log(
          'This file is not allowed. ' + currentFileSize + ' bytes is too large'
        );
        setErrors(
          `The uploaded file of ${currentFileSize} bytes is too large.`
        );
        return false;
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        console.log('Please only upload an image.');
        setErrors('Please only upload an image.');
        return false;
      }
      return true;
    }
  };

  const handleOnDrop = (files, rejectedFiles) => {
    if (rejectedFiles && rejectedFiles.length > 0) {
      setFileName('No file chosen');
      verifyFile(rejectedFiles);
    }
    if (files && files.length > 0) {
      const isVerified = verifyFile(files);
      if (isVerified) {
        const file = files[0].name;
        let nameToShow;
        if (file.length > characterLimit) {
          nameToShow = `${file.substring(
            0,
            characterLimit
          )}...${files[0].type.substring(files[0].type.lastIndexOf('/') + 1)}`;
        } else {
          nameToShow = file;
        }
        setFileName(nameToShow);
        setErrors('');
        // imageBase64Data
        const currentFile = files[0];
        const myFileItemReader = new global.FileReader();
        myFileItemReader.addEventListener(
          'load',
          () => {
            console.log(myFileItemReader.result);
            const myResult = myFileItemReader.result;
            setCharPort(myResult);
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  const onNext = () => {
    const description = {
      lore: {
        alignment: selectionAl,
        personality_traits: personality,
        ideals: ideals,
        bonds: bonds,
        flaws: flaws, 
        backstory: backstory,
        relationships: relationships
      },
      physical_description: {
        height: height,
        weight: weight,
        age: age,
        eyes: eyes,
        skin: skin,
        hair: hair,
      },
      portrait: {name: fileName}
    }
    dispatch(setDescription(charID, description));
    setPage({ index: 5, name: 'equipment' });
    window.scrollTo(0, 0);
  };

  return (
    <div className="background">
      <div className="mx-auto d-none d-md-flex title-back-wrapper">
        <h2 className="title-card p-4">Description</h2>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Personality</h4>
        </div>
        <div className="card content-card description-card">
          <ReactReadMoreReadLess
            charLimit={250}
            readMoreText="Show more"
            readLessText="Show less"
            readMoreClassName="read-more-less--more"
            readLessClassName="read-more-less--less"
          >
            {race.description.summary.join('\n')}
          </ReactReadMoreReadLess>
        </div>
        <Dropdown
          ddLabel="Alignment"
          title="Choose 1"
          items={alignments}
          width="80%"
          selection={selectionAl}
          setSelection={setSelectionAl}
        />
        <div className="card content-card description-card">
          <FloatingLabel
            component="textarea"
            id="persTraits"
            name="persTraits"
            placeholder="Personality Traits"
            type="text"
            value={personality}
            onChange={e => setPersonality(e.target.value)}
          />
        </div>
        <div className="card content-card description-card">
          <FloatingLabel
            component="textarea"
            id="ideals"
            name="ideals"
            placeholder="Ideals"
            type="text"
            value={ideals}
            onChange={e => setIdeals(e.target.value)}
          />
        </div>
        <div className="card content-card description-card">
          <FloatingLabel
            component="textarea"
            id="bonds"
            name="bonds"
            placeholder="Bonds"
            type="text"
            value={bonds}
            onChange={e => setBonds(e.target.value)}
          />
        </div>
        <div className="card content-card description-card mb-0">
          <FloatingLabel
            component="textarea"
            id="flaws"
            name="flaws"
            placeholder="Flaws"
            type="text"
            value={flaws}
            onChange={e => setFlaws(e.target.value)}
          />
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Physical</h4>
        </div>
        <div className="card content-card description-card">
          {race.description.size}
        </div>
        <div className="choice-container">
          <div className="card content-card physical-card choice">
            <FloatingLabel
              id="height"
              name="height"
              placeholder="Height"
              type="text"
              value={height}
              onChange={e => setHeight(e.target.value)}
            />
          </div>{' '}
          <div className="card content-card physical-card choice">
            <FloatingLabel
              id="weight"
              required
              name="weight"
              placeholder="Weight"
              type="text"
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </div>
        </div>
        <div className="card content-card description-card mt-0">
          <ReactReadMoreReadLess
            charLimit={250}
            readMoreText="Show more"
            readLessText="Show less"
            readMoreClassName="read-more-less--more"
            readLessClassName="read-more-less--less"
          >
            {race.description.age}
          </ReactReadMoreReadLess>
        </div>
        <div className="card content-card physical-card">
          <FloatingLabel
            id="age"
            name="age"
            placeholder="Age"
            type="text"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
        </div>
        <div className="choice-container mb-0">
          <div className="card content-card choice mb-0">
            <FloatingLabel
              id="eyes"
              name="eyes"
              placeholder="Eyes"
              type="text"
              value={eyes}
              onChange={e => setEyes(e.target.value)}
            />
          </div>{' '}
          <div className="card content-card choice mb-0">
            <FloatingLabel
              id="skin"
              name="skin"
              placeholder="Skin"
              type="text"
              value={skin}
              onChange={e => setSkin(e.target.value)}
            />
          </div>{' '}
          <div className="card content-card choice mb-0">
            <FloatingLabel
              id="hair"
              name="hair"
              placeholder="Hair"
              type="text"
              value={hair}
              onChange={e => setHair(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title mt-0">
          <h4>Character Portrait</h4>
        </div>
        <img
          className="card content-card"
          src={charPort}
          width="200"
          height="200"
        />
        <Dropzone
          onDrop={handleOnDrop}
          accept="image/*"
          multiple={false}
          maxSize={maxImageSize}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div
                className="card content-card drag-drop-card mb-0"
                {...getRootProps()}
              >
                <button className="btn btn-primary btm-buttons upload-buttons">
                  Choose File
                </button>
                <input {...getInputProps()} />
                <p className="upload-file-name">{fileName}</p>
              </div>
            </section>
          )}
        </Dropzone>
        {errors !== '' && <p className="error-msg">{errors}</p>}
      </div>
      <div className="card translucent-card">
        {' '}
        <div className="card content-card card-title">
          <h4>Other</h4>
        </div>
        <div className="card content-card description-card">
          <FloatingLabel
            component="textarea"
            id="charBackstory"
            name="charBackstory"
            placeholder="Character Backstory"
            type="text"
            value={backstory}
            onChange={e => setBackstory(e.target.value)}
          />
        </div>
        <div className="card content-card description-card mb-0">
          <FloatingLabel
            component="textarea"
            id="relationships"
            name="relationships"
            placeholder="Relationships"
            type="text"
            value={relationships}
            onChange={e => setRelationships(e.target.value)}
          />
        </div>
      </div>
      <button
        className="text-uppercase btn-primary btn-lg px-5 btn-floating"
        onClick={onNext}
      >
        OK
      </button>
    </div>
  );
};

export default Descriptions;
