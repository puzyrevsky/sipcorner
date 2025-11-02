import { useState, useRef, useEffect } from 'react';

import styles from './PartyInfo.module.scss';
import { months } from '../../data/months';

import Wrapper from '../Wrapper/Wrapper';

import waveImageEmpty from '../../image/waveTwoEmpty.png';
import orangeDecor from '../../image/orange-decoration.png';

import imagePartyInfo from '../../image/party-info.png';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import Skeleton from '@mui/material/Skeleton';


import ConfirmedProfiles from '../ConfirmedProfiles/ConfirmedProfiles';



const PartyInfo = ({event, loadingEvent, id, formatDateRu}) => {

    
    
    const people = event?.people || [];
    
    const handleEndingWord = (quantity) => {
        if(quantity % 100 >= 11 && quantity % 100 <= 14) {
            return `${quantity} человек`;
        } else if(quantity % 10 === 1) {
            return `${quantity} человек`;
        } else if(quantity % 10 >= 2 && quantity % 10 <= 4) {
            return `${quantity} человека`;
        } else {
            return `${quantity} человек`;
        }
    }

    const [isShowAllPeople, setIsShowAllPeople] = useState(false);


// 


useEffect(() => {
  document.body.classList.add("home-background");

  return () => {
    document.body.classList.remove("home-background");
  };
}, []);


// 



    return (
        <div className={styles.partyInfo}>
            {/* <picture> */}
                {/* <source media="(max-width: 200px)" srcSet={waveImageSmoll} />
                <source media="(max-width: 850px)" srcSet={waveImageMiddle} /> */}
            {/* </picture> */}
            <div className={styles.waveContainer}>
                <img src={waveImageEmpty} alt=" " className={styles.wave} />
                <img src={orangeDecor} alt=" " className={styles.orangeDecor} />
            </div>
            <Wrapper>
                <h1 id={id} className={styles.partyInfoTitle}>Последние детали</h1>
                <div className={styles.partyInfoSuggestNewCocktailContainer}>
                    <div className={styles.partyInfoSuggestNewCocktailTextButtonContainer}>
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
                        <h2 className={styles.partyInfoSubTitle} style={{marginTop: !event?.date ? '80px' : ''}}>Когда собираемся:</h2>
                        {loadingEvent ? (<Skeleton variant="text" height={22} width={165} sx={{marginTop: '10px', transform: "scale(1, 0.9)"}} />) : (<p className={styles.partyInfoSuggestNewCocktailTextEvent}>{event?.date ? `${formatDateRu(event.date)} в ${event?.time}` : 'Событий нет'}</p>)}
                    </div>
                    <div className={styles.partyInfoSectionConfirmedContainer} style={{marginBottom: people.length === 0 ? '80px' : ''}}>
                        {event?.date && <p style={{margin: people.length > 0 ? '0 0 18px 0' : '0'}} className={styles.partyInfoConfirmedTitleText}>Подтвердили:</p>}
                        {event?.date && (<div>
                            {people.length > 0 ?
                                (<div>
                                    {people.map((person, index) => (
                                        <ConfirmedProfiles index={index} key={person.id} userId={person.id} drinks={person.drinks} name={person.name} gender={person.gender} isShowAllPeople={isShowAllPeople} />
                                    ))}
                                </div>) 
                                :
                                (<p onTouchStart={(e) => e.currentTarget.classList.add(styles.active)} onTouchEnd={(e) => e.currentTarget.classList.remove(styles.active)} className={styles.partyInfoConfirmedShowOthersPeopleText} className={`${styles.partyInfoSuggestNewCocktailText} ${styles.partyInfoSuggestNewCocktailListEmptyText}`}>Пока никто не сделал выбор</p>)
                            }
                        </div>)}
                        {people.length > 2 && 
                            <div className={styles.partyInfoConfirmedShowOthersPeopleTextContainer}>
                                <p onClick={() => setIsShowAllPeople((prev) => !prev)} className={styles.partyInfoConfirmedShowOthersPeopleText}>{!isShowAllPeople ? (`И ещё ${handleEndingWord(people.length - 2)}`) : ('Скрыть')}</p>
                            </div>
                        }
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