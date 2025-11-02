import { useState, useRef, useEffect } from 'react';

import styles from './SectionChoseCocktails.module.scss';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import NoDrinksIcon from '@mui/icons-material/NoDrinks';
import WineBarIcon from '@mui/icons-material/WineBar';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CheckIcon from '@mui/icons-material/Check';

import { addDoc, collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase'; // путь может отличаться



const SectionChoseCocktails = () => {

const [showSection, setShowSection] = useState(false);


// 

const [allCocktails, setAllCocktails] = useState([]);
const [cocktailsRecipe, setCocktailsRecipe] = useState([]);
const [result, setResult] = useState([]);


useEffect(() => {
  const unsub = onSnapshot(collection(db, 'cocktails'), (snap) => {
    setCocktailsRecipe(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  }, (err) => console.error(err));
  return () => unsub();
}, []);

useEffect(() => {
        const fetchPeople = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'event'));

                if(snapshot.empty) {
                    return;
                }

                const firstDoc = snapshot.docs[0];

                if(firstDoc.exists()) {
                    const data = firstDoc.data();

                    const drinksTitle = data.people.flatMap((person) => 
                        person.drinks.map((drink) => ({
                            title: drink.title,
                            quantity: drink.quantity,
                        }))
                    );

                    const summary = {};

                    drinksTitle.forEach(item => {
                        if(!summary[item.title]) {
                            summary[item.title] = 0;
                        }

                        summary[item.title] += item.quantity;
                    })

                    const arrSummary = Object.entries(summary).map(([title, quantity]) => ({
                        title,
                        quantity,
                    }));
                    setAllCocktails(arrSummary);
                }
            } catch (err) {
                console.error("Ошибка загрузки коктейлей:", err);
                alert("Ошибка загрузки коктейлей:", + err);
            } finally {

            }
        }

        fetchPeople();
    }, []);

    console.log(result);

    // 

    useEffect(() => {
        if (allCocktails.length === 0 || cocktailsRecipe.length === 0) return;

        const filter = cocktailsRecipe.filter((item) => allCocktails.some((drink) => drink.title === item.name));

        const scaled = filter.map((recipe) => {
            const selected = allCocktails.find(c => c.title === recipe.name);

            setResult(prev => [...prev, {
                ...recipe, 
                quantity: selected.quantity,
            }]);
        })
        
    }, [allCocktails, cocktailsRecipe]);

    return (
        <div className={styles.sectionUsersChose} 
            onClick={() => { if(!showSection) setShowSection(true)}}
            style={{cursor: !showSection ? 'pointer' : 'default'}}
        >
            <div className={styles.sectionUsersChoseFormContainer} style={{margin: !showSection ? '18px 13px 18px 13px' : '18px 13px 0px 13px',}}>
                <div onClick={() => { if(showSection) setShowSection(false)}} className={styles.sectionUsersChoseTitleOpenContainer} style={{marginBottom: !showSection ? '0px' : '23px', borderBottom: !showSection ? 'none' : '1px solid rgba(128, 128, 128, 0.709)', paddingBottom: !showSection ? '0px' : '20px', cursor: showSection && 'pointer'}}>
                    <p className={styles.sectionUsersChoseTitleOpenContainerText}>Выбрали коктейли <span className={styles.sectionUsersChoseTitleQuantityPeople}>{allCocktails.length}</span></p>
                    <div>
                        {!showSection ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />)}
                    </div>
                </div>
                {showSection && (
                    <div className={styles.sectionUsersChoseContentContainer}>
                        {allCocktails.length === 0 ? 
                            (<p className={styles.sectionUsersChoseNoSelectText}>Нет выбранных коктейлей</p>) 
                            : 
                            (<div>
                                {result.map((drink, index) => (
                                    <div key={index} className={styles.sectionUsersChosePersonCardContainer}>
                                        <p className={styles.sectionUsersChoseNameText}>{drink.name} &nbsp;·&nbsp; <span>{drink.quantity} шт.</span></p>
                                        <ul  className={styles.sectionUsersChoseIngridientsListContainer}>{drink.ingredients.map((ing) => {
                                            const isIng = !!ing.quantity;
                                            const isTopIng = ing.unit === 'top';

                                            return (
                                                <li className={styles.sectionUsersChoseIngridientsText}>{ing.name} - {isIng ? (ing.quantity * drink.quantity) : ''} {!isTopIng ? ing.unit : 'долить до верха'}</li>
                                            )
                                        })}</ul>
                                    </div>
                                ))}
                            </div>)
                        }
                    </div>)
                }
            </div>
        </div>
    )
}

export default SectionChoseCocktails;