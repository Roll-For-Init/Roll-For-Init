import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import './styles.scss';

function Upload() {
    const FILE_SIZE = 2 * 1024 * 1024;
    const SUPPORTED_FORMATS = ['application/pdf'];

    const schema = yup.object().shape({
        char_sheet: yup
            .mixed()
            .required('Please provide a file.')
            .test('type', 'Please only upload a .pdf file.', value => {
                return value && SUPPORTED_FORMATS.includes(value[0].type);
            })
            .test(
                'fileSize',
                'The file you have provided is too large.',
                value => {
                    return value && value[0].size <= FILE_SIZE;
                }
            ),
    });

    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = data => {
        console.log(data);
        // use either redux state or state passed in as props to store uploaded file
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                className="upload-container"
                ref={register}
                type="file"
                name="char_sheet"
            />
            {errors.char_sheet && <p>{errors.char_sheet.message}</p>}
            <button className="btn btn-primary btn-lg btm-buttons modal-buttons">
                Submit
            </button>
        </form>
    );
}

export default Upload;
