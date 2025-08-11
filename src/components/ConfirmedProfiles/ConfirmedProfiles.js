import styles from './ConfirmedProfiles.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import imagePartyInfo from '../../image/party-info.png';

import TouchAppIcon from '@mui/icons-material/TouchApp';





const ConfirmedProfiles = ({name}) => {
    return (
        <div className={styles.confirmedProfiles}>
            <div className={styles.confirmedProfilesContentContainer}>
                <img src={imagePartyInfo} alt={`Имя`} className={styles.confirmedProfilesImage} />
                <p className={styles.confirmedProfilesName}>{name}</p>
            </div>
            <div className={styles.confirmedProfilesCocktailImageContainer}>
                <img src={imagePartyInfo} alt={`Коктейль`} className={styles.confirmedProfilesCocktailImage} />
                <img src={imagePartyInfo} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOther}`} />
                <div className={styles.confirmedProfilesOpenAllCocktailButton}><TouchAppIcon sx={{color: 'white', fontSize: '28px'}} /></div>
                {/* <img src={imagePartyInfo} alt={`Коктейль`} className={`${styles.confirmedProfilesCocktailImage} ${styles.confirmedProfilesCocktailImageOthers}`} /> */}
            </div>
        </div>
    )
}

export default ConfirmedProfiles;