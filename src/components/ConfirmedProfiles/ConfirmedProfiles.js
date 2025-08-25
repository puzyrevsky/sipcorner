import styles from './ConfirmedProfiles.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import manAva from '../../image/manAva.png';
import womanAva from '../../image/womanAva.png';

import TouchAppIcon from '@mui/icons-material/TouchApp';





const ConfirmedProfiles = ({name, gender, drinks, index, isShowAllPeople}) => {

    const avatar = gender === 'мужской' ? manAva : womanAva;

    return (
        <div className={styles.confirmedProfiles} style={{display: index > 1 && !isShowAllPeople ? 'none' : ''}}>
            <div className={styles.confirmedProfilesContentContainer}>
                <img src={avatar} alt={`${name} photo`} className={styles.confirmedProfilesImage} />
                <p className={styles.confirmedProfilesName}>{name}</p>
            </div>
            <div className={styles.confirmedProfilesCocktailImageContainer}>
                {drinks.map((drink, index) => (
                    <img key={drink.id} src={drink.miniatureUrl} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${index !== 0 ? styles.confirmedProfilesCocktailImageOther : ''} ${index > 1 ? styles.confirmedProfilesCocktailImageHidden : ''}`} />
                ))}
                {drinks.length > 2 && <div className={styles.confirmedProfilesOpenAllCocktailButton}><TouchAppIcon sx={{color: 'white', fontSize: '28px'}} /></div>}
            

                {/* <img src={manAva} alt={`Коктейль`} className={styles.confirmedProfilesCocktailImage} />
                <img src={manAva} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOther}`} /> */}
            </div>
        </div>
    )
}
{/* <img src={imagePartyInfo} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOthers}`} /> */}
export default ConfirmedProfiles;