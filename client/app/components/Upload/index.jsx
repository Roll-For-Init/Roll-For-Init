import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from 'yup';

import "./styles.scss";

const schema = yup.object().shape({
  char_sheet: yup
    .mixed()
    .required("Please provide a file")
    .test("type", "Please only upload a PDF file", (value) => {
      return value && value[0].type == "image/pdf";
    }),
})


function Upload() {

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
  });

  const onSubmit = (data) => {
    console.log(data)
    // send to jj's pdf parse component??
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input className="upload-container" ref={register} type="file" name="char_sheet" />
      {errors.char_sheet && <p>{errors.char_sheet_message}</p>}
      <button type="button" className="btn btn-primary btn-lg btm-buttons">
        submit
      </button>
    </form>
  );
}

export default Upload;
