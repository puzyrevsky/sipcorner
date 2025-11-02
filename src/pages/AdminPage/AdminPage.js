import { useState, useEffect } from 'react';

import styles from './AdminPage.module.scss';
import Wrapper from '../../components/Wrapper/Wrapper';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';


import SectionAddIngredients from '../../componentsAdmin/SectionAddIngredients/SectionAddIngredients';
import SectionAddCocktail from '../../componentsAdmin/SectionAddCocktail/SectionAddCocktail';
import SectionEvent from '../../componentsAdmin/SectionEvent/SectionEvent';
import SectionUsersChose from '../../componentsAdmin/SectionUsersChose/SectionUsersChose';
import SectionChoseCocktails from '../../componentsAdmin/SectionChoseCocktails/SectionChoseCocktails';

const AdminPage = ({event}) => {

// 

const [cocktails, setCocktails] = useState([]);


useEffect(() => {
  const unsub = onSnapshot(
    collection(db, 'cocktails'),
    (snap) => {
      setCocktails(
        snap.docs.map(d => ({
          docId: d.id,  // системный ID документа, используется для удаления
          ...d.data(),
        }))
      );
    },
    (err) => console.error(err)
  );
  return () => unsub();
}, []);


// 

const handleDeleteCocktail = async (docId) => {
    if (!window.confirm('Удалить этот коктейль?')) return;
    try {
      await deleteDoc(doc(db, 'cocktails', docId));
      setCocktails(prev => prev.filter(c => c.docId !== docId));
    } catch (error) {
      console.error('Ошибка при удалении коктейля:', error);
      alert('Не удалось удалить коктейль');
    }
};



  return (
    <div style={{ padding: 20 }}>
        <Wrapper>
            <h2 className={styles.adminPage}>Страница администратора</h2>
            <h3 className={styles.adminPageTitleText}>Ингредиенты</h3>
            <SectionAddIngredients />
            <h3 className={styles.adminPageTitleText}>Коктейли</h3>
            <div className={styles.adminPageSectionCocktailsContainer} style={{display: 'flex', flexWrap: 'wrap', gap: '18px'}}>
                {cocktails.length === 0 
                    ? <p>Коктейли не загружены, либо включен VPN</p> 
                    : (<div>
                        {cocktails.map((cocktail) => (
                          <div className={styles.adminPageCardCocktail} key={cocktail.docId}>
                            <h3 className={styles.adminPageCardCocktailName}>{cocktail.name}</h3>
                            <p className={styles.adminPageCardCocktailType}>тип: {cocktail.type}</p>
                            <img className={styles.adminPageCardCocktailImage} src={cocktail.imageUrl} alt={`image ${cocktail.name}`} />
                            <ul className={styles.adminPageCardCocktailListIngredients}>
                              {cocktail.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing.name} · <span className={styles.adminPageCardCocktailQuantityIngredient}>{ing.quantity} {ing.unit}</span></li>
                              ))}
                            </ul>
                            <div className={styles.adminPageDeleteButtonContainer}>
                              <DeleteIcon
                                sx={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => handleDeleteCocktail(cocktail.docId)}
                              />
                            </div>
                          </div>
                        ))}
                    </div>)
                }
            </div>
            <SectionAddCocktail />
            <h3 className={styles.adminPageTitleText}>Мероприятия</h3>
            {event !== null && !event.date ? <SectionEvent /> : <p>Есть актуальное мероприятие</p>}
            {event?.date && 
              <div> 
                <SectionUsersChose />
                <SectionChoseCocktails />
              </div>
            }
        </Wrapper>
    </div>
  );
};

export default AdminPage;