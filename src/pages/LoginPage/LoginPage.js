import { useState } from "react";

import styles from './LoginPage.module.scss';   

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginPageformContainer}>
      <TextField sx={{marginBottom: '18px'}} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} id="email" label="E-mail" variant="outlined" />
      <TextField sx={{marginBottom: '18px'}} id="password" label="Пароль" variant="outlined" type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" type="submit" disabled={!email || !password}>Войти</Button>
    </form>
  );
};

export default LoginPage;
