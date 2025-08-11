import { useState, useRef, useEffect, useMemo } from 'react';

import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, getDocs, doc, snapshotEqual } from 'firebase/firestore';

import styles from './ProductCard.module.scss';

import alcoholicBackground from '../../image/alcoholic-background.png';
import nonAlcoholicBackground from '../../image/non-alcoholic-background.png';
import shotBackground from '../../image/shot-background.png';

import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import LocalBarIcon from '@mui/icons-material/LocalBar';



const ProductsCard = ({type, name, image, ingredients}) => {

    const [listIngredients, setListIngredients] = useState([]);

    // loading coincidence ingredients

    const [loaded, setLoaded] = useState(false);


    //

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'ingredients'),
            (snapshot) => {
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setListIngredients(data);
                setLoaded(true);
            },
            (error) => {
                console.error('Ошибка при загрузке ингредиентов:', error);
            }
        );

        return () => unsubscribe();
    }, [])

    useEffect(() => {
        console.log('listIngredients:', listIngredients);
    }, [listIngredients]);
    

    // 

    const ingredientsQuantity = ingredients.length;
    console.log(ingredientsQuantity)

    const count = listIngredients.filter((i) => ingredients.includes(i.name)).length;

    const missing = ingredients.filter((name) => !listIngredients.some((i) => i.name === name));


    const listBorderColor = {
        fullAvailability: '2px solid rgb(13, 204, 13)',
        partialAvailability: '2px solid rgb(255, 169, 20)',
        completeAbsence: '2px solid rgb(255, 0, 0)',
    }


    const borderColor = useMemo(() => {
        if(!loaded) return '2px solid rgba(13, 204, 13, 0)';
        const diff = ingredientsQuantity - count;

        if(diff === 0 ) return listBorderColor.fullAvailability;
        if(diff === 1 || diff === 2) return listBorderColor.partialAvailability;
        return listBorderColor.completeAbsence;
    }, [loaded, count, ingredientsQuantity]);

    //

    let backgroundImg; 

    if (type === 'Алкогольный') {
        backgroundImg = alcoholicBackground;
    } else if (type === 'Безалкогольный') {
        backgroundImg = nonAlcoholicBackground;
    } else if (type === 'Шот') {
        backgroundImg = shotBackground;
    } else {
        backgroundImg = null; // или какой-то дефолт
    }

    const [isOpenMenuDescription, setIsOpenMenuDescription] = useState(null);

    const openDescription = () => {
        setIsOpenMenuDescription('open');
    };

    const closeDescription = () => {
        setIsOpenMenuDescription('close');
    };

    return (
        <div className={styles.productsCardBorder} style={{border: borderColor}}>
                <div className={styles.productsCard}>
                    <div className={`${styles.productsCardInfoContentContainer} 
                        ${isOpenMenuDescription === 'open' ? styles.productsCardInfoContentContainer__animationOpen : ''} 
                        ${isOpenMenuDescription === 'close' ? styles.productsCardInfoContentContainer__animationClose : ''}`}
                    >
                        <div className={styles.productsCardInfoContent}>
                            {isOpenMenuDescription === 'open' && <CloseIcon onClick={closeDescription} sx={{cursor: 'pointer', position: 'absolute', top: '10px', right: '10px', color: 'black'}} />}
                            <p className={styles.productsCardListIngredientsTitle}>Состав:</p>
                            <ul className={styles.productsCardListIngredientsContainer}>
                                {ingredients.map((ingredient, index) => (
                                    <li style={{color: missing.includes(ingredient) ? 'rgb(255, 0, 0)' : 'rgb(0, 0, 0)'}} key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className={styles.productsCardImageContainer} style={{
                            backgroundImage: backgroundImg ? `url("${backgroundImg}")` : 'none',
                    }}>
                        <img src={image} alt='коктейль Маргарита' className={styles.productsImage} />
                    </div>
                    <div className={styles.productsCardNameInfoContainer}>
                        <h3 className={styles.productsCardName}>{name}</h3>
                        {(isOpenMenuDescription === null || isOpenMenuDescription === 'close') && (<div style={{marginTop: '1px'}}><InfoOutlineIcon onClick={openDescription} sx={{cursor: 'pointer'}} /></div>)}
                    </div>
                    <Button sx={{ textTransform: 'capitalize', fontSize: '16px', width: '100%', marginTop: '21px', backgroundColor: '#2a7c6e'}} variant="contained" endIcon={<LocalBarIcon sx={{ width: 20, height: 20 }} />}>Выбрать</Button>
                </div>
        </div>
    )
}

export default ProductsCard;