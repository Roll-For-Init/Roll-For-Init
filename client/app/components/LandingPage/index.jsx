import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Upload from '../Upload';
import Dropzone from 'react-dropzone';

import './styles.scss';

const LandingPage = () => {
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

  const { isLoggedIn } = useSelector(state => state.auth);
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
      <div className="d-grid gap-2">
        <Link to="/create">
          <button
            type="button"
            className="btn btn-secondary btn-lg top-buttons"
          >
            Create New Character
          </button>
        </Link>
        {/*
        <Link to="/upload">
          <button
            type="button"
            className="btn btn-secondary btn-lg top-buttons"
          >
            Upload Existing Character
          </button>
        </Link>*/}
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
              {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>  */}
              <div className="modal-sect pb-0">
                <h5>Upload a Character</h5>
              </div>
              <div className="modal-sect">
                <p>Please upload your Roll For Init PDF character sheet.</p>
              </div>
              {/* <Upload /> */}
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
      </div>
      {isLoggedIn !== true && (
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
