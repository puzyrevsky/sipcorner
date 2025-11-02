import { useState, useEffect } from "react";

import styles from './NotFound.module.scss';

import Wrapper from "../../components/Wrapper/Wrapper";

import image from '../../image/not-found.png';


const NotFound = () => {

useEffect(() => {
  const setVh = () => {
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  };

  setVh();
  window.addEventListener("resize", setVh);
  return () => window.removeEventListener("resize", setVh);
}, []);


  return (
    <div className={styles.notFound}>
      <Wrapper>
        <div className={styles.notFoundContentContainer}>
            <div className={styles.notFoundImageContainer}>
                <img src={image} alt='Image not found' className={styles.notFoundImage} />
            </div>
            <p className={styles.notFoundText}>Такой страницы не существует</p>
        </div>
      </Wrapper>
    </div>
  );
};

export default NotFound;
