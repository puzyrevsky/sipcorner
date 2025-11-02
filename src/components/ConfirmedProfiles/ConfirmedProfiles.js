import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './ConfirmedProfiles.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import manAva from '../../image/manAva.png';
import womanAva from '../../image/womanAva.png';

import TouchAppIcon from '@mui/icons-material/TouchApp';





const ConfirmedProfiles = ({userId, name, gender, drinks, index, isShowAllPeople}) => {

    const navigate = useNavigate();

    const goToUserDrinks = (idPerson, idCocktail) => {
        navigate(`/drinks/${idPerson}/${idCocktail}`);
    }

    const avatar = gender === 'мужской' ? manAva : womanAva;



    return (
        <div className={styles.confirmedProfiles} style={{display: index > 1 && !isShowAllPeople ? 'none' : ''}}>
            <div className={styles.confirmedProfilesContentContainer}>
                <img src={avatar} alt={`${name} photo`} className={styles.confirmedProfilesImage} />
                <p className={styles.confirmedProfilesName}>{name}</p>
            </div>
            <div className={styles.confirmedProfilesCocktailImageContainer}>
                {drinks.map((drink, index) => (
                    <img key={drink.id} onClick={() => goToUserDrinks(userId, drink.id)} src={drink.miniatureUrl} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${index !== 0 ? styles.confirmedProfilesCocktailImageOther : ''} ${index > 1 ? styles.confirmedProfilesCocktailImageHidden : ''}`} />
                ))}
                {drinks.length > 2 && <div onClick={() => goToUserDrinks(userId, drinks[0].id)} className={styles.confirmedProfilesOpenAllCocktailButton}><TouchAppIcon sx={{color: 'white', fontSize: '28px'}} /></div>}
                

                {/* <img src={manAva} alt={`Коктейль`} className={styles.confirmedProfilesCocktailImage} />
                <img src={manAva} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOther}`} /> */}
            </div>
        </div>
    )
}
{/* <img src={imagePartyInfo} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOthers}`} /> */}
export default ConfirmedProfiles;