import styles from './Categories.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import categoriesPhotoOne from '../../image/alc.png';
import categoriesPhotoTwo from '../../image/free.png';
import categoriesPhotoThre from '../../image/season.png';
import categoriesPhotoFour from '../../image/shot.png';




const Categories = () => {
    return (
        <div className={styles.categoriesSection}>
            <Wrapper>
                <div className={styles.categories}>
                    <ul className={styles.categoriesList}>
                        <li className={styles.categoriesItem}>
                            <img className={styles.categoriesImage} src={categoriesPhotoOne} alt="Алкогогольные" />
                            <p className={styles.categoriesText}>Алкогольные коктейли</p>
                        </li>
                        <li className={styles.categoriesItem}>
                            <img className={styles.categoriesImage} src={categoriesPhotoTwo} alt="Безалкогльные" />
                            <p className={styles.categoriesText}>Безалкогльные коктейли</p>
                        </li>
                        <li className={styles.categoriesItem}>
                            <img className={styles.categoriesImage} src={categoriesPhotoThre} alt="Сезонные" />
                            <p className={styles.categoriesText}>Сезонные коктейли</p>
                        </li>
                        <li className={styles.categoriesItem}>
                            <img className={styles.categoriesImage} src={categoriesPhotoFour} alt="Шоты" />
                            <p className={styles.categoriesText}>Шоты</p>
                        </li>
                    </ul>
                </div>
            </Wrapper>
        </div>
    )
}

export default Categories;