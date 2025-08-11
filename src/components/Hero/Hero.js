import styles from './Hero.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import background from '../../image/background.png';

import Button from '@mui/material/Button';



const Hero = ({onHandleScroll}) => {
    return (
        <div className={styles.hero}>
            <img src={background} alt="" className={styles.heroImage} />
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Всё для вашего настроения</h1>
                <h3 className={styles.subTitle}>Чтобы вечер был без спешки и только в удовольствие</h3>
                <Button onClick={onHandleScroll} sx={{ boxShadow: 'none', borderRadius: '20px', color: '#535353', fontWeight: 'bold', backgroundColor: '#cbe486'}} variant="contained">Что будем пробовать?</Button>
            </div>
        </div>
    )
}

export default Hero;