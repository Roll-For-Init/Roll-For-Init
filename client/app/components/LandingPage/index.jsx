import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Upload from '../Upload';
import Dropzone from 'react-dropzone';

import './styles.scss';
import { PropTypes } from 'prop-types';
import { setCurrentCharacter } from '../../redux/actions';

const DraftCharacterCard = ({ character }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setCurrentCharacter(character.charID));
  };
  return (
    <Link to="/create">
      <button
        onClick={handleClick}
        type="button"
        className="btn btn-secondary btn-lg top-buttons"
      >
        Level 1 {character?.race?.index} { character?.class?.index }
      </button>
    </Link>
  );
};

const UploadCharacter = () => {
  const maxImageSize = 10000000; // bytes
  const acceptedFileTypes = 'application/pdf';
  const characterLimit = 28;
  const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
    return item.trim();
  });

  const [charSheet, setCharSheet] = useState(null);
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
        console.log('Please only upload a PDF.');
        setErrors('Please only upload a PDF.');
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
            setCharSheet(myResult);
            console.log(charSheet);
          },
          false
        );

        myFileItemReader.readAsDataURL(currentFile);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-lg top-buttons"
        data-toggle="modal"
        data-target="#uploadModal"
      >
        Upload Existing Character
      </button>
      <div
        className="modal fade"
        id="uploadModal"
        role="dialog"
        aria-labelledby="characterUpload"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-sect pb-0">
              <h5>Upload a Character</h5>
            </div>
            <div className="modal-sect">
              <p>Please upload your Roll For Init PDF character sheet.</p>
            </div>
            <Dropzone
              onDrop={handleOnDrop}
              accept="application/pdf"
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
        </div>
      </div>
    </>
  );
};

const FinishCharacter = ({ characters }) => {
  if (
    characters === null ||
    characters === undefined ||
    characters?.length === 0
  )
    return;

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary btn-lg top-buttons"
        data-toggle="modal"
        data-target="#finishModal"
      >
        Finish Existing Character
      </button>
      <div
        className="modal fade"
        id="finishModal"
        role="dialog"
        aria-labelledby="characterFinish"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-sect pb-0">
              <h5>Character Drafts</h5>
            </div>
            <div className="modal-sect">
              {Object.keys(characters).map((key, idx) => {
                return (
                  <DraftCharacterCard key={idx} character={characters[key]} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CharacterSection = ({ characters }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(setCurrentCharacter(null));
  };
  return (
    <div className="card d-grid gap-2">
      <FinishCharacter characters={characters} />
      <Link to="/create">
        <button type="button" onClick={handleClick} className="btn btn-secondary btn-lg top-buttons">
          Create New Character
        </button>
      </Link>
      <UploadCharacter />
    </div>
  );
};
const characterPropTypes = PropTypes.shape({});
CharacterSection.propTypes = {
  characters: PropTypes.objectOf(characterPropTypes),
};

const LandingPage = () => {
  const { auth, characters } = useSelector(state => state);
  return (
    <div className="container landing">
      <div className="filler-space"></div>
      <div className="row align-items-center">
        <div className="col-1 col-md"></div>
        <div className="col col-md-6 mb-5">
          <img
            className="logo"
            src={require('../../../public/assets/imgs/logo.png')}
          />
        </div>
        <div className="col-1 col-md"></div>
      </div>
      <CharacterSection characters={characters} />
      {auth.isLoggedIn !== true && (
        <div className="d-grid gap-6 btm-button-container">
          <Link to="/login">
            <button
              type="button"
              className="btn btn-primary btn-lg btm-buttons"
            >
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button
              type="button"
              className="btn btn-primary btn-lg btm-buttons"
            >
              Sign Up
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
