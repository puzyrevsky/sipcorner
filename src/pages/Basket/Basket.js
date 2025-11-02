import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import styles from './Basket.module.scss';

import Wrapper from '../../components/Wrapper/Wrapper';


import { db } from '../../firebase';
import { collection, addDoc, getDocs, getDoc, doc, arrayUnion, updateDoc, arrayRemove} from 'firebase/firestore';

import imageLock from "../../image/lock-image.png";

import Man2Icon from '@mui/icons-material/Man2';
import Woman2Icon from '@mui/icons-material/Woman2';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';






const Basket = ({selectedProducts, onClearProducts, onRemoveProduct, onSwitchSuccessfulNotification, onReplaceProducts}) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [status, setStatus] = useState("loading"); 

    const [name, setName] = useState('');

    const handleChangeInputName = (e) => {
        const value = e.target.value.replace(/\s+/g, '');
        const formatted = value.charAt(0).toUpperCase() + value.slice(1);
        setName(formatted);
    }


    // 

    const [phone, setPhone] = useState('');

    const handleChangeInputPhone = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if(value.length > 7) return;
        setPhone(value);
    }


    // order confirmation flag

    const [justSubmitted, setJustSubmitted] = useState(false);

    useEffect(() => {
        if (justSubmitted) {
            const timer = setTimeout(() => setJustSubmitted(false), 1000); 
            return () => clearTimeout(timer);
        }
    }, [justSubmitted]);


    // 

    const [editPersonId, setEditPersonId] = useState(() => localStorage.getItem("editPersonId"));

    useEffect(() => {
        if (editPersonId) {
            localStorage.setItem("editPersonId", editPersonId);
        } else {
            localStorage.removeItem("editPersonId");
        }
    }, [editPersonId]);


    // 

    const isEditMode = location.state?.edit === true;

    const [redirected, setRedirected] = useState(false);

    
    useEffect(() => {
        if (
            selectedProducts.length === 0 &&
            !isEditMode &&
            !editPersonId &&
            !justSubmitted &&
            !redirected // ⬅️ стопорим, если уже редиректнули вручную
        ) {
            navigate('/', { state: { scrollTo: "products" } });
        }
    }, [navigate, selectedProducts, isEditMode, justSubmitted, editPersonId, redirected]);


    // check unique number for registration

    const [isNumberExists, setIsNumberExists] = useState(false);

    useEffect(() => {
        if (isEditMode) return;

        if (phone.length === 7) {
            const checkPhone = async () => {
                try {
                    const snapshot = await getDocs(collection(db, "event"));
                    const firstDoc = snapshot.docs[0];
                    const data = firstDoc.data();
                    const people = data.people || [];

                    const found = people.find(p => p.phone === phone);

                    if (found && !editPersonId) {
                        // console.log("нашел ✅", found);
                        setIsNumberExists(true);
                        setPhone('');
                    }
                } catch (err) {
                    alert("Ошибка при проверке номера:", err);
                }
            };

            checkPhone();
        }
    }, [isEditMode, phone, editPersonId]);

    useEffect(() => {
        if(isNumberExists && phone.length === 1) {
            setIsNumberExists(false);
        }
    }, [isNumberExists, phone]);


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

    const [gender, setGender] = useState(() => {
        return localStorage.getItem("formGender") || listGender[0].value;
    });


// --- LOAD FROM LOCALSTORAGE ON MOUNT ---

useEffect(() => {
  const savedName = localStorage.getItem("formName");
  const savedPhone = localStorage.getItem("formPhone");
  const savedGender = localStorage.getItem("formGender");

  if (savedName) setName(savedName);
  if (savedPhone) setPhone(savedPhone);
  if (savedGender) setGender(savedGender);
}, []);

// --- SAVE TO LOCALSTORAGE ON CHANGE ---
useEffect(() => {
  localStorage.setItem("formName", name);
}, [name]);

useEffect(() => {
  localStorage.setItem("formPhone", phone);
}, [phone]);

useEffect(() => {
  localStorage.setItem("formGender", gender);
}, [gender]);


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

    const generateUniquePassword = async (docRef) => {
        const snapshot = await getDoc(docRef);
        const people = snapshot.data()?.people || [];

        const existingPasswords = people.map(p => String(p.password));

        let newPassword;

        do {
            const randomNumPassword = Math.floor(Math.random() * 10000);
            newPassword = String(randomNumPassword).padStart(4, "0");
        } while (existingPasswords.includes(newPassword));

        return newPassword;
    }


    // 

    const savePerson = async () => {
        const snapshot = await getDocs(collection(db, "event"));
        const firstDoc = snapshot.docs[0];
        const docRef = doc(db, "event", firstDoc.id);
        const docData = firstDoc.data();
        const people = docData.people || [];


        // проверяем — редактируем ли мы того же человека (по id + телефону)
        
        const isEditingSamePerson = editPersonId && people.some(
            (p) => p.id === editPersonId && p.phone === phone
        );

        if (isEditingSamePerson) {
            // ✅ редактируем существующего
            const updatedPeople = people.map(p =>
            p.id === editPersonId
                ? {
                    ...p,
                    name,
                    phone,
                    gender,
                    drinks: listSelectedCocktails.map(c => ({
                    id: c.id,
                    title: c.name,
                    type: c.type,
                    quantity: c.quantity,
                    imageUrl: c.imageUrl,
                    miniatureUrl: c.miniatureUrl,
                    indexImageBackgroundHistory: Math.floor(Math.random() * 5),
                    coordinatesTitleHistoryY: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
                    coordinatesTitleHistoryX: Math.floor(Math.random() * (40 - 15 + 1)) + 25,
                    })),
                }
                : p
            );

            await updateDoc(docRef, { people: updatedPeople });
        } else {
            // 🆕 создаём нового
            const newId = doc(collection(db, "event")).id;
            const uniquePassword = await generateUniquePassword(docRef);

            const newPerson = {
            id: newId,
            name,
            phone,
            gender,
            drinks: listSelectedCocktails.map(c => ({
                id: c.id,
                title: c.name,
                type: c.type,
                quantity: c.quantity,
                imageUrl: c.imageUrl,
                miniatureUrl: c.miniatureUrl,
                indexImageBackgroundHistory: Math.floor(Math.random() * 5),
                coordinatesTitleHistoryY: Math.floor(Math.random() * (20 - 5 + 1)) + 5,
                coordinatesTitleHistoryX: Math.floor(Math.random() * (40 - 15 + 1)) + 25,
            })),
            password: uniquePassword,
            };

            await updateDoc(docRef, { people: arrayUnion(newPerson) });
        }

        // 🧹 очистка localStorage (включая форму)
        setEditPersonId(null);
        localStorage.removeItem("selectCocktail");
        localStorage.removeItem("formName");
        localStorage.removeItem("formPhone");
        localStorage.removeItem("formGender");

        // очистка выбранных продуктов
        onClearProducts();

        // сброс локального state формы
        setName("");
        setPhone("");
        setGender(listGender[0].value);

        // подтверждение заказа флаг
        
        setJustSubmitted(true);

        // редирект и уведомление
        navigate("/", { state: { scrollTo: "last-details" }, replace: true });
        onSwitchSuccessfulNotification(true);
    };





    useEffect(() => {
        const setVh = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };
        setVh();
        window.addEventListener('resize', setVh);
        return () => window.removeEventListener('resize', setVh);
    }, []);


    useEffect(() => {
        document.body.classList.add("basket-background");

        return () => {
            document.body.classList.remove("basket-background");
        };
    }, []);


    const [verifyPhone, setVerifyPhone] = useState('');
    const [wrongNumber, setWrongNumber] = useState(false);

    const handleChangeVerifyPhone = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // только цифры
        if (value.length > 7) return;
        setVerifyPhone(value);
    };

useEffect(() => {
    if (!isEditMode) return;

    if (verifyPhone.length === 7) {
        const checkPhone = async () => {
            try {
                const snapshot = await getDocs(collection(db, "event"));
                const firstDoc = snapshot.docs[0];
                const data = firstDoc.data();
                const people = data.people || [];

                const found = people.find(p => p.phone === verifyPhone);

                if (found) {
                    // console.log("нашел ✅", found);

                    // сохраняем id человека
                    setEditPersonId(found.id);

                    // 1. заменяем продукты
                    const selectedIds = found.drinks.map(d => d.id);
                    onReplaceProducts(selectedIds);

                    // 2. подтягиваем данные
                    setName(found.name);
                    setGender(found.gender);
                    setPhone(found.phone);

                    // 3. подтягиваем напитки (с количеством)
                    setCocktails(prev =>
                        prev.map(c =>
                        selectedIds.includes(c.id)
                            ? { ...c, quantity: found.drinks.find(fd => fd.id === c.id)?.quantity || 1 }
                            : c
                        )
                    );

                    // 4. убираем edit:true
                    navigate(location.pathname, { replace: true });
                } else {
                    // console.log("не найден ❌");
                    setWrongNumber(true);
                    setVerifyPhone('');
                }
            } catch (err) {
                alert("Ошибка при проверке номера:", err);
            }
        };

        checkPhone();
    }
}, [verifyPhone, isEditMode, navigate, location.pathname]);


useEffect(() => {
    if(wrongNumber && verifyPhone.length === 1) {
        setWrongNumber(false);
    }
}, [wrongNumber, verifyPhone]);


// delete person from list confirmed

const cancelPerson = async () => {
  if (!editPersonId) return;

  try {
    const snapshot = await getDocs(collection(db, "event"));
    const firstDoc = snapshot.docs[0];
    const docRef = doc(db, "event", firstDoc.id);
    const data = firstDoc.data();
    const people = data.people || [];

    // находим человека по id
    const personToRemove = people.find(p => p.id === editPersonId);
    if (!personToRemove) return;

    // удаляем его из массива people
    await updateDoc(docRef, {
      people: arrayRemove(personToRemove)
    });

    // очистка
    setEditPersonId(null);
    localStorage.removeItem("selectCocktail");
    localStorage.removeItem("formName");
    localStorage.removeItem("formPhone");
    localStorage.removeItem("formGender");

    onClearProducts();
    setName("");
    setPhone("");
    setGender(listGender[0].value);

    // редирект
    setRedirected(true); // ⬅️ вот тут стопор
    navigate("/", { state: { scrollTo: "top" } });
  } catch (err) {
    alert("Ошибка при удалении: " + err.message);
  }
};



    return (
        <div className={styles.basket}> 
            {isEditMode && 
                <div className={styles.basketPasswordContainer}>
                    <div className={styles.basketPasswordContentContainer}>
                        <CloseIcon onClick={() => navigate(-1, { replace: true, state: {} })} sx={{position: 'absolute', top: '13px', right: '13px', cursor: 'pointer', color: 'rgb(64, 87, 67);', transition: '0.3s', "&:hover": {transition: '0.3s', opacity: '0.7'}}} />
                        <div className={styles.basketPasswordScreensaverContainer}>
                            <img src={imageLock} alt='image screensaver' className={styles.basketPasswordScreensaver} />
                        </div>
                        <p className={styles.basketPasswordTitle}>Чтобы изменить свой выбор введи номер телефона</p>
                        <TextField
                            type="tel"
                            value={verifyPhone}
                            onChange={handleChangeVerifyPhone}
                            label="Номер телефона (последние 7 цифр)"
                            placeholder="XXXXXXX"
                            variant="filled"
                            error={wrongNumber}
                            helperText={wrongNumber ? "Неверный номер" : ""}
                            inputProps={{
                                maxLength: 7,
                                inputMode: 'numeric',   // для мобилок — цифровая клавиатура
                                pattern: '[0-9]*'       // браузерные подсказки, что нужны только цифры
                            }}
                            sx={{
                                maxWidth: '310px',
                                width: '100%',
                                backgroundColor: "rgba(255,255,255,0.3)",
                                backdropFilter: "blur(2px)",
                                WebkitBackdropFilter: "blur(2px)",
                                // padding: '0 13px',
                            }}
                        />
                    </div>
                </div>
            }
            <div className={styles.wrapperBasket}>
                <h3 className={styles.basketSectionTitle}>Подтверди выбор</h3>
                <div className={styles.basketInputNameContainer}>
                    <TextField sx={{maxWidth: '310px', width: '100%', backgroundColor: "rgba(255,255,255,0.3)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",}} value={name} onChange={handleChangeInputName} id="filled-basic" label="Имя" variant="filled" />
                </div>
                <div className={styles.basketInputPhoneContainer}>
                    <TextField
                        type="tel"
                        value={phone}
                        onChange={handleChangeInputPhone}
                        label="Номер телефона (последние 7 цифр)"
                        placeholder="XXXXXXX"
                        variant="filled"
                        error={isNumberExists}
                        helperText={isNumberExists ? "Номер занят" : ""}
                        inputProps={{
                            maxLength: 7,
                            inputMode: 'numeric',   // для мобилок — цифровая клавиатура
                            pattern: '[0-9]*'       // браузерные подсказки, что нужны только цифры
                        }}
                        sx={{
                            maxWidth: '310px',
                            width: '100%',
                            backgroundColor: "rgba(255,255,255,0.3)",
                            backdropFilter: "blur(2px)",
                            WebkitBackdropFilter: "blur(2px)",
                        }}
                    />
                    <span>Номер телефона нужен для изменения выбора</span>
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
                            <p className={styles.basketSelectedCoctailsTitle}>Выбранные коктейли</p>
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
                    </div>)
                }
                <div className={styles.basketButtonGroupContainer}>
                    <Button onClick={() => navigate('/')} sx={{width: '100px', padding: '3px 0', borderRadius: '21px', backgroundColor: '#979797', textTransform: 'capitalize', fontSize: '16px', boxShadow: 'none', }} variant="contained">Главная</Button>
                    <Button onClick={() => navigate('/cocktails')} sx={{width: '200px', padding: '3px 0', borderRadius: '21px', backgroundColor: '#979797', textTransform: "none", "&::first-letter": {textTransform: "uppercase",}, fontSize: '16px', boxShadow: 'none', marginLeft: '10px', }} variant="contained">Список коктейлей</Button>
                </div>
                <div className={styles.basketButtonGroupSaveDeleteContainer}>
                    {status === 'ready' && (<Button onClick={savePerson} disabled={!name.trim() || phone.length !== 7} sx={{'&.Mui-disabled': {backgroundColor: '#808080a3', opacity: 0.7, color: '#fff',}, padding: '3px 13px', borderRadius: '21px', backgroundColor: '#8ac640', textTransform: "none", "&::first-letter": {textTransform: "uppercase",}, fontSize: '16px', boxShadow: 'none', maxWidth: '310px', width: '100%'}} variant="contained">Подтвердить {handleEndingWord(sum)}</Button>)}
                    {editPersonId && (<Button onClick={cancelPerson} disabled={!name.trim() || phone.length !== 7} sx={{'&.Mui-disabled': {backgroundColor: '#808080a3', opacity: 0.7, color: '#fff',}, marginTop: '30px', padding: '3px 13px', borderRadius: '21px', backgroundColor: '#d98888', textTransform: "none", "&::first-letter": {textTransform: "uppercase",}, fontSize: '16px', boxShadow: 'none', maxWidth: '310px', width: '100%'}} variant="contained">Планы поменялись, отменить все</Button>)}
                </div>
            </div>
        </div>
    )
}

export default Basket;