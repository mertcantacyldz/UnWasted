import React, { useState, useEffect } from 'react';
import './LoginRegister.css';
import { Login } from './Login';
import { Register } from './Register';

function LoginRegister() { 
  const[currentForm, setCurrentForm] = useState('login'); /*Which form displayed atm*/
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  const [login, setLogin] = useState([])

  useEffect(() => {
    fetch('/login')
      .then(response => response.text())
      .then(response => console.log(response))
    }, [])

  return (
    <div className="App">
      {
        /*current form loginse logini yoksa registeri gosterir */
        /*toggleForm yaparak sayfada kalmasini sagliyoruz*/
        currentForm === "login" ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
     }
    </div>
  );
}

export default LoginRegister;
