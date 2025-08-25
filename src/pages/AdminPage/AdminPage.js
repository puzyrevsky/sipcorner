import { useState, useEffect } from 'react';

import styles from './AdminPage.module.scss';
import Wrapper from '../../components/Wrapper/Wrapper';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';


import SectionAddIngredients from '../../componentsAdmin/SectionAddIngredients/SectionAddIngredients';
import SectionAddCocktail from '../../componentsAdmin/SectionAddCocktail/SectionAddCocktail';
import SectionEvent from '../../componentsAdmin/SectionEvent/SectionEvent';

const AdminPage = ({event}) => {

// 

const [cocktails, setCocktails] = useState([]);

// useEffect(() => {
//     const fetchCocktails = async () => {
//         try {
//             const snapshot = await getDocs(collection(db, 'cocktails'));
//             const data = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setCocktails(data);
//         } catch (error) {
//             console.error('Ошибка при загрузке коктейлей:', error);
//         }
//     };

//     fetchCocktails();
// }, []);

useEffect(() => {
  const unsub = onSnapshot(collection(db, 'cocktails'), (snap) => {
    setCocktails(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (err) => console.error(err));
  return () => unsub();
}, []);

// 

  return (
    <div style={{ padding: 20 }}>
        <Wrapper>
            <h2 className={styles.adminPage}>Страница администратора</h2>
            <h3 className={styles.adminPageTitleText}>Ингредиенты</h3>
            <SectionAddIngredients />
            <h3 className={styles.adminPageTitleText}>Коктейли</h3>
            <div>
                {cocktails.length === 0 
                    ? <p>Коктейли не загружены, либо включен VPN</p> 
                    : (<div>
                        {cocktails.map((cocktail) => (
                            <div className={styles.adminPageCardCocktail} key={cocktail.id}>
                                <h3 className={styles.adminPageCardCocktailName}>{cocktail.name}</h3>
                                <p className={styles.adminPageCardCocktailType}>тип: {cocktail.type}</p>
                                <img className={styles.adminPageCardCocktailImage} src={cocktail.imageUrl} alt={`image ${cocktail.name}`} />
                                <ul className={styles.adminPageCardCocktailListIngredients}>
                                    {cocktail.ingredients.map((ing, idx) => (
                                    <li key={idx}>{ing}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>)
                }
            </div>
            <SectionAddCocktail />
            <h3 className={styles.adminPageTitleText}>Мероприятия</h3>
            {event !== null && !event.date ? <SectionEvent /> : <p>Есть актуальное мероприятие</p>}
        </Wrapper>
    </div>
  );
};

export default AdminPage;