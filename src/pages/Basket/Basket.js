import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Basket.module.scss';

import Wrapper from '../../components/Wrapper/Wrapper';


import { db } from '../../firebase';
import { collection, addDoc, getDocs, getDoc, doc, arrayUnion, updateDoc} from 'firebase/firestore';


import Man2Icon from '@mui/icons-material/Man2';
import Woman2Icon from '@mui/icons-material/Woman2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';






const Basket = ({selectedProducts, onClearProducts, onRemoveProduct, onSwitchSuccessfulNotification}) => {

    const navigate = useNavigate();

    const [status, setStatus] = useState("loading"); 

    const [name, setName] = useState('');

    const handleChangeInputName = (e) => {
        const value = e.target.value.replace(/\s+/g, '');
        const formatted = value.charAt(0).toUpperCase() + value.slice(1);
        setName(formatted);
    }


    // 

    const listGender = [
        {
            value: 'мужской',
            icon: <Man2Icon />,
        },
        {
            value: 'женский',
            icon: <Woman2Icon />,
        },
    ]

    const [gender, setGender] = useState(listGender[0].value);

    
    //

    const [cocktails, setCocktails] = useState([]);
    
    useEffect(() => {
        setCocktails(prev =>
            prev.map(cocktail =>
            selectedProducts.includes(cocktail.id)
                ? { ...cocktail, quantity: cocktail.quantity || 1 } // если выбран → quantity минимум 1
                : { ...cocktail, quantity: 1 } // если не выбран → 1
            )
        );
    }, [selectedProducts]);


    // 

    useEffect(() => {
        const fetchCocktails = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'cocktails'));
                const data = snapshot.docs.map((doc) => ({
                    quantity: 1,
                    id: doc.id,
                    imageUrl: doc.imageUrl,
                    miniatureUrl: doc.miniatureUrl,
                    ...doc.data(),
                }));
                setCocktails(data);
            } catch (error) {
                alert('Ошибка загрузки коктейлей:', error);
            }
        };

        fetchCocktails();
    }, []);


    useEffect(() => {
        if(selectedProducts.length === 0) {
            setStatus('empty');
            return;
        }

        if(cocktails.length > 0) {
            setStatus('ready');
            return;
        }

        setStatus("loading");
        const timer = setTimeout(() => {
            setStatus('error');
        }, 5000);

        return () => clearTimeout(timer);
    }, [cocktails, selectedProducts]);
    

    const listSelectedCocktails = useMemo(() => {
        return cocktails.filter(cocktail => selectedProducts.includes(cocktail.id));
    }, [cocktails, selectedProducts]);

    
    // 

    const addToQuantity = (id) => {
        setCocktails((prev) => {
            return prev.map(cocktail => (
                cocktail.id === id ? {...cocktail, quantity: cocktail.quantity +1} : cocktail
            ));
        })
    }

    const removeFromQuantity = (id) => {
        setCocktails((prev) => {
            return prev.map(cocktail => (
                cocktail.id === id && cocktail.quantity > 1 ? {...cocktail, quantity: cocktail.quantity -1} : cocktail
            ));
        })
    }


    // 

    const totalQuantity = listSelectedCocktails.map(cocktail => cocktail.quantity);

    let sum = 0;
    totalQuantity.map(item => sum += item);

    const handleEndingWord = (quantity) => {
        if(quantity % 100 >= 11 && quantity % 100 <= 14) {
            return `${quantity} напитков`;
        } else if(quantity % 10 === 1) {
            return `${quantity} напиток`;
        } else if(quantity % 10 >= 2 && quantity % 10 <= 4) {
            return `${quantity} напитка`;
        } else {
            return `${quantity} напитков`;
        }
    }

    
    // 

    


    const savePerson = async () => {
        const snapshot = await getDocs(collection(db, "event"));
        const firstDoc = snapshot.docs[0];
        const docRef = doc(db, "event", firstDoc.id);

        const docSnap = await getDoc(docRef);
        const existingPeople = docSnap.data().people || [];

        const newPerson = {
            name,
            gender,
            drinks: listSelectedCocktails.map(c => ({
                id: c.id,
                title: c.name,
                type: c.type,
                quantity: c.quantity,
                imageUrl: c.imageUrl,
                miniatureUrl: c.miniatureUrl,
            })),

        }

        try {
            await updateDoc(docRef, {
                people: [...existingPeople, newPerson]
            });
            localStorage.removeItem('selectCocktail');
            onClearProducts();
            setName('');
            setGender(listGender[0].value);
            navigate('/', {state: {scrollTo: "last-details"}});
            onSwitchSuccessfulNotification(true);
        } catch (e) {
            console.error("Ошибка подтверждения:", e);
        }
    };



    return (
        <div className={styles.basket}>
            <Wrapper>
                <h3 className={styles.basketSectionTitle}>Подтверди выбор</h3>
                <div className={styles.basketInputNameContainer}>
                    <TextField sx={{backgroundColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",}} value={name} onChange={handleChangeInputName} id="filled-basic" label="Имя" variant="filled" />
                </div>
                <div>
                    <p className={styles.basketGenderText}>Пол: {gender}</p>
                    <ToggleButtonGroup
                        sx={{backgroundColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)",}}
                        value={gender}
                        exclusive
                        onChange={(_, newGender) => {
                            if (newGender !== null) setGender(newGender);
                        }}
                        aria-label="Выбор пола"
                    >
                        {listGender.map((button, index) => (
                            <ToggleButton
                                key={index}
                                value={button.value}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "#d9d9d9", // светлый фон (основной)
                                        color: "#5ca55d",
                                    },
                                    "&.Mui-selected:hover": {
                                        backgroundColor: "#cfcfcf", // слегка темнее
                                    },
                                    "&.Mui-selected:active": {
                                        backgroundColor: "#c9c9c9", // ещё на полтона темнее
                                    },
                                    "&.Mui-selected.Mui-focusVisible": {
                                        backgroundColor: "#cfcfcf", // тоже мягкое затемнение
                                    },
                                }}
                            >
                                {button.icon}
                            </ToggleButton>))
                        }
                    </ToggleButtonGroup>
                </div>
                {status !== 'ready' ?
                    <p>{status === 'loading' ? 'Загрузка' : status === 'empty' ? 'Выбранных напитков нет' : status === 'error' ? 'Ошибка загрузки, проверь подключение к сети или выключи VPN' : null}</p> : 
                    (<div>
                        <div>
                            <p>Выбранные коктейли</p>
                            {listSelectedCocktails.map((cocktail) => (
                                <div className={styles.basketCardSelectedCocktail} key={cocktail.id}>
                                    <div className={styles.basketImageSelectedCocktailContainer}>
                                        <img src={cocktail.imageUrl} alt={`Image ${cocktail.name}`} className={styles.basketImageSelectedCocktail} />
                                    </div>
                                    <div className={styles.basketCardSelectedCocktailInfoContainer}>
                                        <p className={styles.basketCardSelectedCocktailTitle}>{cocktail.name}</p>
                                        <p className={styles.basketCardSelectedCocktailType}>{cocktail.type}</p>
                                        <p className={styles.basketCardSelectedCocktailQuantityText}>Количество: {cocktail.quantity}</p>
                                        <div className={styles.basketCardSelectedCocktailButtonGroupContainer}>
                                            <ToggleButtonGroup
                                                size="small"
                                                sx={{backgroundColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(1px)", WebkitBackdropFilter: "blur(1px)",}}
                                                exclusive
                                            >
                                                <ToggleButton
                                                    disabled={cocktail.quantity === 1}
                                                    onClick={() => removeFromQuantity(cocktail.id)}
                                                    sx={{
                                                        "&.Mui-selected": {
                                                            backgroundColor: "#d9d9d9", // светлый фон (основной)
                                                            color: "#5ca55d",
                                                        },
                                                        "&.Mui-selected:hover": {
                                                            backgroundColor: "#cfcfcf", // слегка темнее
                                                        },
                                                        "&.Mui-selected:active": {
                                                            backgroundColor: "#c9c9c9", // ещё на полтона темнее
                                                        },
                                                        "&.Mui-selected.Mui-focusVisible": {
                                                            backgroundColor: "#cfcfcf", // тоже мягкое затемнение
                                                        },
                                                    }}
                                                >
                                                    <RemoveIcon />
                                                </ToggleButton>
                                                <ToggleButton
                                                    onClick={() => addToQuantity(cocktail.id)}
                                                    sx={{
                                                        "&.Mui-selected": {
                                                            backgroundColor: "#d9d9d9", // светлый фон (основной)
                                                            color: "#5ca55d",
                                                        },
                                                        "&.Mui-selected:hover": {
                                                            backgroundColor: "#cfcfcf", // слегка темнее
                                                        },
                                                        "&.Mui-selected:active": {
                                                            backgroundColor: "#c9c9c9", // ещё на полтона темнее
                                                        },
                                                        "&.Mui-selected.Mui-focusVisible": {
                                                            backgroundColor: "#cfcfcf", // тоже мягкое затемнение
                                                        },
                                                    }}
                                                >
                                                    <AddIcon />
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                            <IconButton onClick={() => onRemoveProduct(cocktail.id)} sx={{marginLeft: '25px'}} aria-label="delete">
                                                <DeleteIcon sx={{color: '#ff5357'}} />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={savePerson} disabled={!name.trim()} sx={{'&.Mui-disabled': {backgroundColor: '#808080a3', opacity: 1, color: '#fff',},}} variant="contained">Подтвердить {handleEndingWord(sum)}</Button>
                    </div>)
                }
            </Wrapper>
        </div>
    )
}

export default Basket;