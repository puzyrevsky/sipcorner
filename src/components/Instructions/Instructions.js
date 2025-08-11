import styles from './Instructions.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import instructionsPhoto from '../../image/instructions.png';



const Instructions = () => {
    return (
        <Wrapper>
            <div className={styles.instructions}>
                <div className={styles.instructionsContent}>
                    <img src={instructionsPhoto} alt="Коктейль" className={styles.instructionsPhoto} />                
                    <div className={styles.heroContent}>
                        <h1 className={styles.instructionsTitle}>Как это работает</h1>
                        <ol className={styles.instructionsList}>
                            <li className={styles.instructionsItem}>Выбираете коктейли заранее.</li>
                            <li className={styles.instructionsItem}>Я готовлю всё к вашему приходу.</li>
                            <li className={styles.instructionsItem}>Наслаждаемся вечером без суеты!</li>
                        </ol>
                    </div>
                </div>
            </div>
        </Wrapper>
    )
}

export default Instructions;