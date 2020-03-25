import React, { useState, useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import './Form.css';
const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field."),
  email: yup.string() .email("Must be a valid email address.") .required("Must include email address."),
  password: yup.string().required("password is a required field."),
  terms: yup.boolean().oneOf([true], "please agree to terms of use"),
  positions: yup.string(),
 
});
export default function Form() {
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    positions: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
    positions: "",

  });

  const [post, setPost] = useState([]);

  useEffect(() => {
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    });
  }, [formState]);

  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {console.log(res.data)
        setPost([
            ...post,
            res.data
        ]); 


        console.log( post);
      
        setFormState({
          name: "",
          email: "",
          password: "",
          terms: "",
          positions: "",
        
        });
      })
      .catch(err => console.log(err.response));
  };

  const validateChange = e => {
    
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        });
      });
  };

  const inputChange = e => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };

    validateChange(e);
    setFormState(newFormData);
  };

const users =[<pre>{JSON.stringify(post, null, 3)}</pre>]

  return (

    <form onSubmit={formSubmit}>
      <div className="section">
      <label htmlFor="name">
         Name
        <input
          type="text"
           name="name"
          value={formState.name}
          onChange={inputChange}
          />  {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
        
      </label>
</div> 
      <div className="section">
      <label htmlFor="email">
        Email
        <input
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
       
        {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}

      </label>
      </div> 
      <div className="section"> 
      <label htmlFor="password">
        Password
        <input
          type="text"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errors.password.length > 0 ? <p className="error">{errors.password}</p> : null}
      </label>
</div>
<div className="section">    
      <label htmlFor="positions">
      Role
        <select id="positions" name="positions" onChange={inputChange}>

          <option value="backend">backend</option>
          <option value="frontend">frontend</option>
          <option value="designer">designer</option>
          
        </select>
      </label>
</div>
<div className="section">
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        Terms of Service
      </label>
</div>

<div className="bottom">
      <div>{users}</div>
      <button disabled={buttonDisabled}>Submit</button>
</div>   
    </form>
  );
}
