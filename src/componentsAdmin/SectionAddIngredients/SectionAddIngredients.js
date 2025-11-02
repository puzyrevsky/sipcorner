import { useState, useRef, useEffect } from 'react';

import styles from './SectionAddIngredients.module.scss';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';

import { addDoc, collection, doc, setDoc, getDocs, deleteDoc} from 'firebase/firestore';
import { db } from '../../firebase'; // путь может отличаться



const SectionAddIngredients = () => {

    const [textInput, setTextInput] = useState('');

    const handleTextInput = (e) => {
        let value = e.target.value;
        if (value.length === 1) {
            value = value.charAt(0).toUpperCase();
        }
        setTextInput(value);
    }

// 

     const handleButtonAdd = async () => {
        const trimmedInput = textInput.trim();
        if (!trimmedInput) return;

        try {
            const newDocRef = doc(collection(db, 'ingredients'));
            await setDoc(newDocRef, {
                id: newDocRef.id,
                name: trimmedInput,
                createdAt: new Date(),
            });
            setTextInput('');
            fetchIngredients(); // ⬅ обновляем список после добавления
        } catch (error) {
            alert('Ошибка при добавлении: ' + error.message);
        }
    };

// 


const [listIngredient, setListIngredient] = useState([]);

const fetchIngredients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ingredients'));
      const ingredients = querySnapshot.docs.map(doc => doc.data());
      setListIngredient(ingredients);
    } catch (error) {
      alert('Ошибка при загрузке: ' + error.message);
    }
};

  useEffect(() => {
    fetchIngredients();
  }, []);

// 

const handleButtonDelete = async (id) => {
    try {
        await deleteDoc(doc(db, 'ingredients', id));
        fetchIngredients();
    } catch (error) {
        alert('Ошибка при удалении: ', + error.message)
    }
};

    return (
        <div className={styles.sectionAddIngredientsContainer}>
            <div className={styles.sectionAddIngredientsListContainer}>
                {listIngredient.map((ingredient) => (
                    <div key={ingredient.id} className={styles.sectionAddIngredientsBlockIngredient}>
                        <p className={styles.sectionAddIngredientsBlockIngredientText}>{ingredient.name}</p>
                        <CloseIcon onClick={() => handleButtonDelete(ingredient.id)} sx={{cursor: 'pointer', position: 'absolute', right: '11px', top: '9px'}}/>
                    </div>
                ))}
            </div>
            <div className={styles.sectionAddIngredientsFormContainer}>
                <TextField value={textInput} onChange={(e) => handleTextInput(e)} sx={{marginBottom: '13px'}} id="outlined-basic" label="Название ингредиента" variant="outlined" inputProps={{ autoCapitalize: "none" }} />
                <Button onClick={handleButtonAdd} variant="contained">Добавить ингредиент</Button>
            </div>
        </div>
    )
}

export default SectionAddIngredients;