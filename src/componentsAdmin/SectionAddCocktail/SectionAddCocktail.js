import { useState, useRef, useEffect } from 'react';

import styles from './SectionAddCocktail.module.scss';

import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
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
import { useTheme } from '@mui/material/styles';

import { addDoc, collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // путь может отличаться

import stubImageCocktail from '../../image/stub-image-cocktail.png';
import stubImageCocktailAuthor from '../../image/stub-image-cocktail-author.png';

import stubMiniatureCocktail from '../../image/stub-miniature-cocktail.png';

const SectionAddCocktail = () => {

const [showSection, setShowSection] = useState(false);

//

    const [nameTextInput, setNameTextInput] = useState('');

    const handleNameTextInput = (e) => {
        let value = e.target.value;
        if (value.length === 1) {
            value = value.charAt(0).toUpperCase();
        }

        setNameTextInput(value);
    }

// 

    const [listIngredients, setListIngredients] = useState([]);


    const [nameIngredientTextInput, setNameIngredientTextInput] = useState('');

    const handleNameIngredientTextInput = (e) => {
        let value = e.target.value;
        if (value.length === 1) {
            value = value.charAt(0).toUpperCase();
        }
        setNameIngredientTextInput(value);
    }

    
    // 

    const [quantityIngredient, setQuantityIngredient] = useState('');

    const handleQuantityIngredient = (e) => {
        setQuantityIngredient(e.target.value);
    }


    // 

    const measurementList = ['мл.', 'шт.', 'гр.', 'унц.', 'шот', 'бар. лож.', 'ч. л.', 'ст. л.', 'дэш', 'капл.', 'top', 'щепот.', 'слой', 'лист.', 'половин.', 'каёмка',];

    const [measurement, setMeasurement] = useState('мл.');

    const [isExpandMeasurement, setIsExpandMeasurement] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    const clickMeasurement = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setHasClicked(true);
        setIsExpandMeasurement(prev => !prev);
    };

    const clickSelectMeasurement = (selectedMeasurement) => {
        if(selectedMeasurement === measurement) {
            return;
        }
        setMeasurement(selectedMeasurement);
        clickMeasurement();
    }


    const measurementRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (measurementRef.current && !measurementRef.current.contains(event.target)) {
                setIsExpandMeasurement(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // 

    const isAddDisabled = (measurement === 'top' || measurement === 'слой' || measurement ===  'каёмка')
        ? !nameIngredientTextInput.trim()    // только название обязательно
        : (!nameIngredientTextInput.trim() || !quantityIngredient.trim()); // название + количество


    const handleButtonAddIngredient = () => {
        const name = nameIngredientTextInput.trim();
        const quantity = quantityIngredient.trim();

        // if(measurement === 'top' || measurement === 'слой') {
        //     if(!name) return;
        // } else if(!name || !quantity) return;

        // if(!name || !quantity) return;

        if(isAddDisabled) return;

        const ingredient = {
            name,
            quantity,
            unit: measurement,
        }

        setListIngredients(prev => [...prev, ingredient]);

        setNameIngredientTextInput('');
        setQuantityIngredient('');
        setMeasurement('мл.');
    }


    // 

    const handleButtonDeleteIngredient = (index) => {
        setListIngredients(prev => prev.filter((_, i) => i !== index));
    }

// 

    // const handleButtonAdd = async () => {
    //     const trimmedInput = textInput.trim();
    //     if (!trimmedInput) return;

    //     try {
    //         const newDocRef = doc(collection(db, 'ingredients'));
    //         await setDoc(newDocRef, {
    //             id: newDocRef.id,
    //             name: trimmedInput,
    //             createdAt: new Date(),
    //         });
    //         setTextInput('');
    //         fetchIngredients(); // ⬅ обновляем список после добавления
    //     } catch (error) {
    //         alert('Ошибка при добавлении: ' + error.message);
    //     }
    // };

// 


// const [listIngredient, setListIngredient] = useState([]);

// const fetchIngredients = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, 'ingredients'));
//       const ingredients = querySnapshot.docs.map(doc => doc.data());
//       setListIngredient(ingredients);
//     } catch (error) {
//       alert('Ошибка при загрузке: ' + error.message);
//     }
// };

//   useEffect(() => {
//     fetchIngredients();
//   }, []);

// 

// const handleButtonDelete = async (id) => {
//     try {
//         await deleteDoc(doc(db, 'ingredients', id));
//         fetchIngredients();
//     } catch (error) {
//         alert('Ошибка при удалении: ', + error.message)
//     }
// };

const [alignment, setAlignment] = useState('Алкогольный');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    if(newAlignment !== null) {
        setAlignment(newAlignment);
    }
  };


// handle checked have image

const [haveImage, setHaveImage] = useState(true);

const handleHaveImage = (event) => {
    setPreviewImageUrl('');
    setPreviewMiniatureUrl('');
    setHaveImage(event.target.checked);
}

const theme = useTheme();


// handle checked author's recipe

const [isAuthor, setIsAuthor] = useState(false);

const handleIsAuthor = (event) => {
    setIsAuthor(event.target.checked);
}


// loading image cloudinary

  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [previewMiniatureUrl, setPreviewMiniatureUrl] = useState('');

  const [loading, setLoading] = useState(false);

  const fileImageInputRef = useRef(null);
  const fileMiniatureInputRef = useRef(null);

  const handleClickAddingImage = () => {
    setPreviewImageUrl('');
    if (fileImageInputRef.current) fileImageInputRef.current.value = '';
    fileImageInputRef.current?.click();
  }

  const handleClickAddingMiniature = () => {
    setPreviewMiniatureUrl('');
    if (fileMiniatureInputRef.current) fileMiniatureInputRef.current.value = '';
    fileMiniatureInputRef.current?.click();
  }

  const handleUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const cloudName = 'drdwtnk5z'; // <-- замени
    const uploadPreset = 'project_cocktails'; // <-- замени

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        if(type === 'image') {
            setPreviewImageUrl(data.secure_url);
        } else if(type === 'miniature') {
            setPreviewMiniatureUrl(data.secure_url);
        }
        // Тут можно, например, отправить ссылку в Firebase
      } else {
        console.error('Upload failed', data);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

// 

const addCocktail = async () => {

    const name = nameTextInput.trim();

    const newDocRef = doc(collection(db, 'cocktails'));

    const payload = {
        id: newDocRef.id,
        name,                                  // название
        ingredients: listIngredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
        })), // массив ингредиентов
        type: alignment,                       // категория: Алкогольный/Безалкогольный/Шот
        haveImage: haveImage,
        imageUrl: haveImage ? previewImageUrl : (!isAuthor ? stubImageCocktail : stubImageCocktailAuthor),          // ссылка на фото (может быть null)
        miniatureUrl: haveImage ? previewMiniatureUrl : stubMiniatureCocktail,
        isAuthor: isAuthor, // авторский или по рецепту
        createdAt: serverTimestamp(), // серверное время
    };

    try {
        const ref = await addDoc(collection(db, 'cocktails'), payload);
        console.log('Cocktail saved with id:', ref.id);

        // очистим форму
        setNameTextInput('');
        setListIngredients([]);
        setPreviewImageUrl('');
        setPreviewMiniatureUrl('');
        setHaveImage(true);
        setIsAuthor(false);
        setAlignment('Алкогольный');
        alert('Коктейль сохранён!');

    } catch (error) {
        alert('Ошибка при загрузке: ' + error.message);
    }
}

// 


const isSaveDisabled =
  loading ||                       // пока грузится фото
  !nameTextInput.trim() ||         // нет названия
  listIngredients.length === 0 ||  // нет ингредиентов
  nameIngredientTextInput.trim() ||
  (haveImage && (!previewImageUrl || !previewMiniatureUrl));
  quantityIngredient.trim();

    return (
        <div className={styles.sectionAddCocktail} 
            onClick={() => { if(!showSection) setShowSection(true)}}
            style={{cursor: !showSection ? 'pointer' : 'default'}}
        >
            {/* <div className={styles.sectionAddIngredientsListContainer}>
                {listIngredient.map((ingredient) => (
                    <div key={ingredient.id} className={styles.sectionAddIngredientsBlockIngredient}>
                        <p className={styles.sectionAddIngredientsBlockIngredientText}>{ingredient.name}</p>
                        <CloseIcon onClick={() => handleButtonDelete(ingredient.id)} sx={{cursor: 'pointer', position: 'absolute', right: '11px', top: '9px'}}/>
                    </div>
                ))}
            </div> */}
            <div className={styles.sectionAddCocktailFormContainer} style={{margin: !showSection ? '18px 13px 18px 13px' : '18px 13px 0px 13px',}}>
                <div onClick={() => { if(showSection) setShowSection(false)}} className={styles.sectionAddCocktailTitleOpenContainer} style={{marginBottom: !showSection ? '18px' : '23px', borderBottom: !showSection ? 'none' : '1px solid rgba(128, 128, 128, 0.709)', paddingBottom: !showSection ? '0px' : '20px', cursor: showSection && 'pointer'}}>
                    <p className={styles.sectionAddCocktailTitleOpenContainerText}>Добавить коктейль</p>
                    <div>
                        {!showSection ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />)}
                    </div>
                </div>
                {showSection && (
                    <div className={styles.sectionAddCocktailContentContainer}>
                        <TextField value={nameTextInput} onChange={(e) => handleNameTextInput(e)} sx={{marginBottom: '35px'}} id="outlined-basic" label="Название коктейля" variant="outlined" />
                        {listIngredients.length === 0 ? <p className={styles.sectionAddCocktailFormTect}>Нет ингредиентов</p> :
                            <div className={styles.sectionAddCocktailIngredientsContainer}>
                                {listIngredients.map((ingredient, index) => (
                                    <div key={index} className={styles.sectionAddIngredientsBlockIngredient}>
                                        <p className={styles.sectionAddIngredientsBlockIngredientText}>{ingredient.name} &nbsp;·&nbsp; {ingredient.quantity} {ingredient.unit}</p>
                                        <CloseIcon onClick={() => handleButtonDeleteIngredient(index)} sx={{cursor: 'pointer', position: 'absolute', right: '11px', top: '9px'}}/>
                                    </div>
                                ))}
                            </div>
                        }
                        <div style={{marginTop: listIngredients.length === 0 ? '20px' : '0px'}} className={styles.sectionAddCocktailFormAddIngredientsContainer}>
                            <div className={styles.sectionAddCocktailFormAddIngredients}>
                                <TextField value={nameIngredientTextInput} onChange={(e) => handleNameIngredientTextInput(e)} sx={{width: '100%', marginRight: '13px', marginBottom: '17px'}} id="outlined-basic" label="Название ингредиента" variant="outlined" />
                                {/* <Fab disabled={!nameIngredientTextInput.trim()} onClick={handleButtonAddIngredient} sx={{width: '70px', height: '55px', borderRadius: '8px'}} color="primary" aria-label="add">
                                    <AddIcon />
                                </Fab> */}
                            </div>
                            <div className={styles.sectionAddCocktailFormAddIngredientsQuantity}>
                                <TextField value={quantityIngredient} onChange={(e) => handleQuantityIngredient(e)} type="number" inputProps={{ min: 0, pattern: "[0-9]*", inputMode: "numeric"}} sx={{width: '100%', marginRight: '13px'}} id="outlined-basic" label="Количество" variant="outlined" />
                                <div ref={measurementRef} className={styles.productsCategoryWrapper}>
                                    <div
                                        onClick={(e) => clickMeasurement(e)}
                                        className={styles.productsCategoryContainer}
                                        style={{ borderRadius: isExpandMeasurement ? '13px 13px 0 0' : '13px' }}
                                    >
                                        <p>{measurement}</p>
                                        <div className={
                                            hasClicked
                                                ? (isExpandMeasurement
                                                    ? styles.productsCategoryArrowBottomContainer
                                                    : styles.productsCategoryArrowTopContainer)
                                                : ''
                                        }>
                                            <KeyboardArrowDownIcon sx={{marginTop: '5px'}} />
                                        </div>
                                    </div>
                                    {isExpandMeasurement && 
                                        <div className={styles.productsCategoryListContainer}>
                                            <ul className={styles.productsCategoryList}>
                                                {measurementList.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => clickSelectMeasurement(item)}
                                                    className={`${item !== isExpandMeasurement
                                                    ? styles.productsCategoryItem
                                                    : styles.productsCategoryItem__selected}`}
                                                >
                                                    {item} {item === measurement && <CheckIcon sx={{ fontSize: '20px' }} />}
                                                </li>
                                                ))}
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </div>
                            <Button variant="contained" disabled={isAddDisabled} onClick={handleButtonAddIngredient} sx={{width: '100%', height: '34px', borderRadius: '8px', marginTop: '17px'}} color="primary" aria-label="add">Добавить</Button>
                        </div>
                        <div className={styles.sectionAddCocktailCategoriesContainer}>
                            <div>
                                <p className={styles.sectionAddCocktailCategoriesText}>{alignment}</p>
                                <ToggleButtonGroup
                                    value={alignment}
                                    exclusive
                                    onChange={handleAlignment}
                                    aria-label="text alignment"
                                    size="small"
                                    sx={{marginTop: '10px'}}
                                >
                                    <ToggleButton value="Алкогольный" aria-label="left aligned">
                                        <LocalBarIcon />
                                    </ToggleButton>
                                    <ToggleButton value="Безалкогольный" aria-label="centered">
                                        <NoDrinksIcon />
                                    </ToggleButton>
                                    <ToggleButton value="Шот" aria-label="right aligned">
                                        <WineBarIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                            <div>
                                <FormControlLabel
                                    sx={{flexDirection: 'column-reverse'}}
                                    control={
                                        <Switch
                                            checked={isAuthor}
                                            onChange={handleIsAuthor}
                                            slotProps={{ input: { 'aria-label': 'controlled' } }}
                                            sx={{
                                                '& .MuiSwitch-switchBase': {
                                                color: theme.palette.primary.main, // ползунок выключен - синий
                                                '&.Mui-checked': {
                                                    color: theme.palette.primary.main, // ползунок включен - синий
                                                },
                                                '&.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: theme.palette.primary.main, // дорожка включена - синий
                                                },
                                                },
                                                '& .MuiSwitch-track': {
                                                backgroundColor: theme.palette.primary.main, // дорожка выключена - тоже синий
                                                },
                                            }}
                                        />
                                    }
                                    label={!isAuthor ? 'По рецепту' : 'Авторский'}
                                />
                            </div>
                        </div>
                        <div className={styles.sectionAddCocktailAddImageContainer}>
                            <div>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={haveImage}
                                                onChange={handleHaveImage}
                                                slotProps={{ input: { 'aria-label': 'controlled' } }}
                                            />
                                        }
                                        label={haveImage ? 'Есть фото' : 'Нет фото'}
                                    />
                                </FormGroup>
                                {haveImage && (
                                    <div> 
                                        <div className={styles.sectionAddCocktailImageContainer}>
                                            {previewImageUrl ? (
                                                <img
                                                    src={previewImageUrl}
                                                    alt="Uploaded"
                                                    style={{
                                                    maxWidth: '300px',
                                                    width: '100%',
                                                    height: '300px',
                                                    objectFit: 'contain'
                                                    }}
                                                />
                                                ) : (
                                                <p>{loading ? 'Загрузка изображения...' : 'Изображение не выбрано'}</p>
                                            )}
                                        </div>
                                        <div className={styles.sectionAddCocktailMiniatureContainer}>
                                            {previewMiniatureUrl ? (
                                                <img
                                                    src={previewMiniatureUrl}
                                                    alt="Uploaded"
                                                    style={{
                                                    maxWidth: '100px',
                                                    width: '100%',
                                                    height: '100px',
                                                    objectFit: 'contain'
                                                    }}
                                                />
                                                ) : (
                                                <p style={{fontSize: '12px', textAlign: 'center'}}>{loading ? 'Загрузка миниатюры...' : 'Миниатюра не выбрана'}</p>
                                            )}
                                        </div>
                                        <input ref={fileImageInputRef} style={{ display: "none" }} onClick={(e) => { e.currentTarget.value = null; }} type="file" onChange={(e) => handleUpload(e, 'image')} />
                                        <input ref={fileMiniatureInputRef} style={{ display: "none" }} onClick={(e) => { e.currentTarget.value = null; }} type="file" onChange={(e) => handleUpload(e, 'miniature')} />
                                        <Button
                                            sx={{marginTop: '13px'}}
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            onClick={handleClickAddingImage}
                                        >Загрузить изображение</Button>
                                        <Button
                                            sx={{marginTop: '13px'}}
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            onClick={handleClickAddingMiniature}
                                        >Загрузить миниатюру</Button>
                                    </div>)
                                }
                            </div>
                        </div>
                        <div onClick={() => { if (!isSaveDisabled) addCocktail(); }} className={styles.sectionAddCocktailButtonSave} style={{backgroundColor: isSaveDisabled ? 'grey' : undefined, cursor: isSaveDisabled ? 'default' : 'pointer', opacity: isSaveDisabled ? 0.55 : 1,}}>
                            <p style={{color: nameIngredientTextInput && 'white'}} className={styles.sectionAddCocktailButtonSaveText}>Сохранить коктейль</p>
                        </div>
                    </div>)
                }
            </div>
        </div>
    )
}

export default SectionAddCocktail;