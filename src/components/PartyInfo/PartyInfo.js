import { useState, useRef } from 'react';

import styles from './PartyInfo.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import waveImage from '../../image/waveTwo.png';
import imagePartyInfo from '../../image/party-info.png';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';


import ConfirmedProfiles from '../ConfirmedProfiles/ConfirmedProfiles';



const PartyInfo = () => {


    return (
        <div className={styles.partyInfo}>
            <img src={waveImage} alt='' className={styles.wave} />
            <Wrapper>
                <h1 className={styles.partyInfoTitle}>Последние детали</h1>
                <div className={styles.partyInfoSuggestNewCocktailContainer}>
                    <div>
                        <p className={styles.partyInfoSuggestNewCocktailText}>Не увидел в списке то, что любишь или хотел попробовать?</p>
                        <p className={styles.partyInfoSuggestNewCocktailText}>Дай знать в Telegram — договоримся!</p>
                        <Button 
                            component="a" 
                            href="https://t.me/Puzyrevsky" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            variant="contained" 
                            endIcon={<EmailIcon />} 
                            sx={{
                                textTransform: 'capitalize',
                                fontSize: '18px',
                                marginTop: '23px', 
                                boxShadow: 'none', 
                                backgroundColor: '#8ac640', 
                                borderRadius: '25px'}}
                            >Telegram</Button>
                    </div>
                    <img src={imagePartyInfo} alt='Picture of cocktails' className={styles.partyInfoSuggestNewCocktailImage} />
                </div>
                <div className={styles.partyInfoNearestPartyConfirmedProfilesContainer}>
                    <div className={styles.partyInfoNearestPartyContainer}>
                        <h2 className={styles.partyInfoSubTitle}>Когда собираемся:</h2>
                        <p className={styles.partyInfoSuggestNewCocktailText}>1 августа в 18:00</p>
                    </div>
                    <div>
                        <p className={styles.partyInfoConfirmedTitleText}>Подтвердили</p>
                        <ConfirmedProfiles name='Макс' />
                        <ConfirmedProfiles name='Андрей' />
                        <ConfirmedProfiles name='Александр' />
                    </div>
                 </div>
                <div className={styles.partyInfoAddressContainer}>
                    <h2 className={styles.partyInfoSubTitle}>Если забыл адрес:</h2>
                    <a target="_blank" className={`${styles.partyInfoSuggestNewCocktailText} ${styles.partyInfoLink}`} href='https://yandex.by/maps/geo/3427366845/?ll=27.592536%2C53.908766&z=19.05'>ул. Платонова, 21, подъезд 2</a>
                </div>
            </Wrapper>
        </div>
    )
}

export default PartyInfo;