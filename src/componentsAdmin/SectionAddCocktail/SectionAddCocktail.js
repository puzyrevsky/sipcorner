import { useState, useRef, useEffect } from 'react';

import styles from './SectionAddCocktail.module.scss';

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

import { addDoc, collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // путь может отличаться



const SectionAddCocktail = () => {

const [showSection, setShowSection] = useState(false);

//

    const [nameTextInput, setNameTextInput] = useState('');

    const handleNameTextInput = (e) => {
        setNameTextInput(e.target.value);
    }

// 

    const [listIngredients, setListIngredients] = useState([]);


    const [nameIngredientTextInput, setNameIngredientTextInput] = useState('');

    const handleNameIngredientTextInput = (e) => {
        setNameIngredientTextInput(e.target.value);
    }

    const handleButtonAddIngredient = () => {
        const trimmed = nameIngredientTextInput.trim();

        if(!trimmed) return;

        setListIngredients(prev => [...prev, trimmed]);
        setNameIngredientTextInput('');
    }

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


// loading image cloudinary

  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleClickAddingImage = () => {
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    fileInputRef.current?.click();
  }

  const handleUpload = async (event) => {
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
        setPreviewUrl(data.secure_url);
        console.log('Image uploaded:', data.secure_url);
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

    const payload = {
        name,                                  // название
        ingredients: listIngredients,          // массив ингредиентов
        type: alignment,                       // категория: Алкогольный/Безалкогольный/Шот
        imageUrl: previewUrl || null,          // ссылка на фото (может быть null)
        createdAt: serverTimestamp(),          // серверное время
    };

    try {
        const ref = await addDoc(collection(db, 'cocktails'), payload);
        console.log('Cocktail saved with id:', ref.id);

        // очистим форму
        setNameTextInput('');
        setListIngredients([]);
        setPreviewUrl('');
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
  !previewUrl; 

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
                <div onClick={() => { if(showSection) setShowSection(false)}} className={styles.sectionAddCocktailTitleOpenContainer} style={{marginBottom: !showSection ? '0px' : '23px', borderBottom: !showSection ? 'none' : '1px solid rgba(128, 128, 128, 0.709)', paddingBottom: !showSection ? '0px' : '20px', cursor: showSection && 'pointer'}}>
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
                                        <p className={styles.sectionAddIngredientsBlockIngredientText}>{ingredient}</p>
                                        <CloseIcon onClick={() => handleButtonDeleteIngredient(index)} sx={{cursor: 'pointer', position: 'absolute', right: '11px', top: '9px'}}/>
                                    </div>
                                ))}
                            </div>
                        }
                        <div style={{marginTop: listIngredients.length === 0 ? '20px' : '0px'}} className={styles.sectionAddCocktailFormAddIngredientsContainer}>
                            <TextField value={nameIngredientTextInput} onChange={(e) => handleNameIngredientTextInput(e)} sx={{width: '100%', marginRight: '13px'}} id="outlined-basic" label="Название ингредиента" variant="outlined" />
                            <Fab disabled={!nameIngredientTextInput.trim()} onClick={handleButtonAddIngredient} sx={{width: '70px', height: '55px', borderRadius: '8px'}} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </div>
                        <div className={styles.sectionAddCocktailCategoriesContainer}>
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
                        <div className={styles.sectionAddCocktailAddImageContainer}>
                            <div>
                                {previewUrl && (<p style={{margin: '0px 0px 10px 0'}}>Загружено:</p>)}
                                <div className={styles.sectionAddCocktailImageContainer}>
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
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
                                    {/* {loading && <p>Загрузка изображения...</p>} */}
                                </div>
                            </div>
                            <input ref={fileInputRef} style={{ display: "none" }} onClick={(e) => { e.currentTarget.value = null; }} type="file" onChange={handleUpload} />
                            <Button
                                sx={{marginTop: '13px'}}
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                onClick={handleClickAddingImage}
                            >Загрузить изображение</Button>
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