import React, { useState } from 'react';
import { connect } from 'react-redux';
//import { getDescriptionInfo } from '../../actions';
import FloatingLabel from 'floating-label-react';
import 'floating-label-react/styles.css';
import { Form, Field } from 'react-final-form';
import Dropdown from '../shared/Dropdown';
import charPlaceholder from '../../../public/assets/imgs/char-placeholder.png';
import Dropzone from 'react-dropzone';

export const Descriptions = props => {
    // const { descriptions } = props.descriptions;

    // const selectDescription = description => {
    //     props.selectDescription(description);
    // };

    const maxImageSize = 10000000; // bytes
    const acceptedFileTypes =
        'image/x-png, image/png, image/jpg, image/jpeg, image/gif';
    const acceptedFileTypesArray = acceptedFileTypes.split(',').map(item => {
        return item.trim();
    });

    const [selectionAl, setSelectionAl] = useState([]);
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
                    'This file is not allowed. ' +
                        currentFileSize +
                        ' bytes is too large'
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
                setFileName(files[0].name);
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
        props.setPage({ index: 4, name: 'abilities' });
        window.scrollTo(0, 0);
    };

    const alignments = [
        {
            index: 'lawful-good',
            name: 'Lawful Good',
            abbreviation: 'LG',
            desc:
                'Lawful good (LG) creatures can be counted on to do the right thing as expected by society. Gold dragons, paladins, and most dwarves are lawful good.',
            url: 'api/alignments/lawful-good',
        },
        {
            index: 'neutral-good',
            name: 'Neutral Good',
            abbreviation: 'NG',
            desc:
                'Neutral good (NG) folk do the best they can to help others according to their needs. Many celestials, some cloud giants, and most gnomes are neutral good.',
            url: 'api/alignments/neutral-good',
        },
        {
            index: 'chaotic-good',
            name: 'Chaotic Good',
            abbreviation: 'CG',
            desc:
                'Chaotic good (CG) creatures act as their conscience directs, with little regard for what others expect. Copper dragons, many elves, and unicorns are chaotic good.',
            url: 'api/alignments/chaotic-good',
        },
        {
            index: 'lawful-neutral',
            name: 'Lawful Neutral',
            abbreviation: 'LN',
            desc:
                'Lawful neutral (LN) individuals act in accordance with law, tradition, or personal codes. Many monks and some wizards are lawful neutral.',
            url: 'api/alignments/lawful-neutral',
        },
        {
            index: 'neutral',
            name: 'Neutral',
            abbreviation: 'N',
            desc:
                'Neutral (N) is the alignment of those who prefer to steer clear of moral questions and don’t take sides, doing what seems best at the time. Lizardfolk, most druids, and many humans are neutral.',
            url: 'api/alignments/neutral',
        },
        {
            index: 'chaotic-neutral',
            name: 'Chaotic Neutral',
            abbreviation: 'CN',
            desc:
                'Chaotic neutral (CN) creatures follow their whims, holding their personal freedom above all else. Many barbarians and rogues, and some bards, are chaotic neutral.',
            url: 'api/alignments/chaotic-neutral',
        },
        {
            index: 'lawful-evil',
            name: 'Lawful Evil',
            abbreviation: 'LE',
            desc:
                'Lawful evil (LE) creatures methodically take what they want, within the limits of a code of tradition, loyalty, or order. Devils, blue dragons, and hobgoblins are lawful evil.',
            url: 'api/alignments/lawful-evil',
        },
        {
            index: 'neutral-evil',
            name: 'Neutral Evil',
            abbreviation: 'NE',
            desc:
                'Neutral evil (NE) is the alignment of those who do whatever they can get away with, without compassion or qualms. Many drow, some cloud giants, and goblins are neutral evil.',
            url: 'api/alignments/neutral-evil',
        },
        {
            index: 'chaotic-evil',
            name: 'Chaotic Evil',
            abbreviation: 'CE',
            desc:
                'Chaotic evil (CE) creatures act with arbitrary violence, spurred by their greed, hatred, or bloodlust. Demons, red dragons, and orcs are chaotic evil.',
            url: 'api/alignments/chaotic-evil',
        },
    ];

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
                    Choose a preset background, or create your own. Your
                    background reveals where you came from. how you became an
                    adventurer, and your place in the world. If you create a
                    custom background, work with your GM to build one that makes
                    sense for your character.
                </div>
                <Dropdown
                    title="Alignment"
                    items={alignments}
                    width="50%"
                    selection={selectionAl}
                    setSelection={setSelectionAl}
                />
                <div className="card content-card description-card">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="persTraits"
                            placeholder="Personality Traits"
                        />
                    </form>
                </div>
                <div className="card content-card description-card">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="ideals"
                            placeholder="Ideals"
                        />
                    </form>
                </div>
                <div className="card content-card description-card">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="bonds"
                            placeholder="Bonds"
                        />
                    </form>
                </div>
                <div className="card content-card description-card mb-0">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="flaws"
                            placeholder="Flaws"
                        />
                    </form>
                </div>
            </div>
            <div className="card translucent-card">
                {' '}
                <div className="card content-card card-title">
                    <h4>Physical</h4>
                </div>
                <div className="card content-card description-card">
                    Choose a preset background, or create your own. Your
                    background reveals where you came from. how you became an
                    adventurer, and your place in the world. If you create a
                    custom background, work with your GM to build one that makes
                    sense for your character.
                </div>
                <div className="choice-container">
                    <div className="card content-card physical-card choice">
                        <form>
                            <input
                                style={{
                                    border: 'none',
                                    width: '100%',
                                }}
                                type="text"
                                name="height"
                                placeholder="Height"
                            />
                        </form>
                    </div>{' '}
                    <div className="card content-card physical-card choice">
                        {/* <FloatingLabel
                            id="weight"
                            name="weight"
                            placeholder="Weight"
                            type="email"
                            value="150"
                        /> */}
                    </div>
                </div>
                <div className="card content-card description-card mt-0">
                    Choose a preset background, or create your own. Your
                    background reveals where you came from. how you became an
                    adventurer, and your place in the world. If you create a
                    custom background, work with your GM to build one that makes
                    sense for your character.
                </div>
                <div className="card content-card physical-card">
                    <form style={{ padding: '0px 5px' }}>
                        <input
                            className="p-0 m-0"
                            style={{ border: 'none', width: '100%' }}
                            type="text"
                            name="age"
                            placeholder="Age"
                        />
                    </form>
                </div>
                <div className="choice-container ">
                    <div className="card content-card choice mb-0">
                        <form style={{ padding: '0px' }}>
                            <input
                                className="p-0 m-0"
                                style={{ border: 'none', width: '100%' }}
                                type="text"
                                name="eyes"
                                placeholder="Eyes"
                            />
                        </form>
                    </div>{' '}
                    <div className="card content-card choice mb-0">
                        <form style={{ padding: '0px' }}>
                            <input
                                className="p-0 m-0"
                                style={{ border: 'none', width: '100%' }}
                                type="text"
                                name="skin"
                                placeholder="Skin"
                            />
                        </form>
                    </div>{' '}
                    <div className="card content-card choice mb-0">
                        <form style={{ padding: '0px' }}>
                            <input
                                className="p-0 m-0"
                                style={{ border: 'none', width: '100%' }}
                                type="text"
                                name="hair"
                                placeholder="Hair"
                            />
                        </form>
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
                                className="card content-card drag-drop-card"
                                {...getRootProps()}
                            >
                                <button className="btn btn-primary btm-buttons upload-buttons">
                                    Choose File
                                </button>
                                <input {...getInputProps()} />
                                <p>{fileName}</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
                {errors !== '' && (
                    <p style={{ color: 'white' }} className="mb-0 pb-0">
                        {errors}
                    </p>
                )}
            </div>
            <div className="card translucent-card">
                {' '}
                <div className="card content-card card-title">
                    <h4>Other</h4>
                </div>
                <div className="card content-card description-card">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="charBackstory"
                            placeholder="Character Backstory"
                        />
                    </form>
                </div>
                <div className="card content-card description-card mb-0">
                    <form>
                        <textarea
                            style={{
                                background: '#f2e9d9',
                                border: 'none',
                                width: '100%',
                            }}
                            type="text"
                            name="relationships"
                            placeholder="Relationships"
                        />
                    </form>
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
