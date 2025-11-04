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
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';



const ProductsCard = ({hide, index, id, type, name, image, ingredients, event, selectedProducts, onAddProduct, onRemoveProduct}) => {

    const [listIngredients, setListIngredients] = useState([]);

    // loading coincidence ingredients

    const [loaded, setLoaded] = useState(false);


    //

    const isSelected = selectedProducts.includes(id);

    const toggleSelect = () => {
        if(isSelected) {
            onRemoveProduct(id);
        } else {
            onAddProduct(id);
        }
    }


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
    

    // 

    const ingredientsQuantity = ingredients.length;

    const count = listIngredients.filter((i) => ingredients.some((ing) => ing.name === i.name)).length;

    const missing = ingredients.filter((ing) => !listIngredients.some((i) => i.name === ing.name));


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

    
// 

    const [isWide, setIsWide] = useState(window.innerWidth > 900 || window.innerWidth < 600);

    useEffect(() => {
    const mediaLarge = window.matchMedia("(min-width: 901px)");
    const mediaSmall = window.matchMedia("(max-width: 599px)");

    const update = () => {
        setIsWide(mediaLarge.matches || mediaSmall.matches);
    };

    // инициализация
    update();

    // подписки
    mediaLarge.addEventListener("change", update);
    mediaSmall.addEventListener("change", update);

    return () => {
        mediaLarge.removeEventListener("change", update);
        mediaSmall.removeEventListener("change", update);
    };
    }, []);


    const quantityShownCards = isWide ? 3 : 4;

    const isHidden = hide && index >= quantityShownCards;


    // 



    return (
        <div className={styles.productsCardBorder} style={{border: borderColor, display: isHidden ? "none" : ""}}>
                <div className={styles.productsCard}>
                    <div className={`${styles.productsCardInfoContentContainer} 
                        ${isOpenMenuDescription === 'open' ? styles.productsCardInfoContentContainer__animationOpen : ''} 
                        ${isOpenMenuDescription === 'close' ? styles.productsCardInfoContentContainer__animationClose : ''}`}
                    >
                        <div className={styles.productsCardInfoContent}>
                            {isOpenMenuDescription === 'open' && <CloseIcon onClick={closeDescription} sx={{cursor: 'pointer', position: 'absolute', top: '10px', right: '10px', color: 'black'}} />}
                            <p className={styles.productsCardListIngredientsTitle}>Состав:</p>
                            <ul className={styles.productsCardListIngredientsContainer}>
                                {ingredients.map((ingredient, index) => {
                                    const isMissing = missing.some(m => m.name === ingredient.name);
                                    return (
                                        <li className={styles.productsCardItemIngredients} style={{color: isMissing ? 'rgb(99, 99, 99)' : 'rgb(0, 0, 0)'}} key={index}>{isMissing ? <HighlightOffIcon sx={{fontSize: '22px', color: 'red', marginRight: '7px'}} /> : <CheckCircleOutlineIcon sx={{fontSize: '22px', color: 'green', marginRight: '7px'}} />}{ingredient.name}</li>
                                    )
                                })}
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
                        <div style={{marginTop: '1px', marginLeft: '10px'}}>{(isOpenMenuDescription === null || isOpenMenuDescription === 'close') && (<InfoOutlineIcon onClick={openDescription} sx={{cursor: 'pointer'}} />)}</div>
                    </div>
                    <p className={styles.productsCardTypeText}>{type}</p>
                    {event?.date ? (<Button onClick={toggleSelect} sx={{ textTransform: 'capitalize', fontSize: '16px', width: '100%', marginTop: '21px', backgroundColor: '#2a7c6e'}} variant="contained" endIcon={!isSelected ? (<LocalBarIcon sx={{ width: 20, height: 20 }} />) : (<DoNotDisturbOnIcon sx={{ width: 20, height: 20 }} />)}>{!isSelected ? 'Выбрать' : 'Отменить'}</Button>) : (<p className={styles.productsCardNotEventText}>Ближайших событий нет</p>)}
                </div>
        </div>
    )
}

export default ProductsCard;