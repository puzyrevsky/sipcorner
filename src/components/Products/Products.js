import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';

import styles from './Products.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import waveImage from '../../image/waveOneEmpty.png';
import rozmarinDecor from '../../image/rozmarin-decoration.png';


import ProductsCard from '../ProductCard/ProductCard';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import Skeleton from '@mui/material/Skeleton';



const Products = ({id, cocktails, event, sectionRef, selectedProducts, onAddProduct, onRemoveProduct}) => {

    const navigate = useNavigate();


    const categoriesList = [
        'Все',
        'Алкогольный',
        'Безалкогольный',
        'Шот',
    ]


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


    const quantityItemInArray = isWide ? 3 : 4;

    const arrayElementsSkeleton = [...Array(quantityItemInArray).keys()];


// 

    const [isExpandCategory, setIsExpandCategory] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    const [category, setCategory] = useState('Все');

    const clickCategory = (event) => {
        if (event) {
            event.stopPropagation();
        }
        setHasClicked(true);
        setIsExpandCategory(prev => !prev);
    };

    const clickSelectCategory = (selectedCategory) => {
        if(selectedCategory === category) {
            return;
        }
        setCategory(selectedCategory);
        clickCategory();
    }


    // 
    
    const sortingCocktails = useMemo(() => {
        if(category === 'Все') return cocktails;

        return cocktails.filter((i) => (
            i.type.toLowerCase() === category.toLocaleLowerCase()
        ));
    }, [cocktails, category]);


    // 

    const categoryRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsExpandCategory(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
    //             alert('Ошибка при загрузке коктейлей:', error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     }; 

    //     fetchCocktails();
    // }, []);


    const [mountedOnce, setMountedOnce] = useState(true);

    useEffect(() => {
        let timer;

        if(event) {
            timer = setTimeout(() => {
                setMountedOnce(false);
            }, 700);
        }
        
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className={styles.products} ref={sectionRef}>
            <div className={styles.waveContainer}>
                <img src={waveImage} alt='' className={styles.wave} />
                <img src={rozmarinDecor} alt=" " className={styles.rozmarinDecor} />
            </div>
            <div className={styles.productsContentContainer}>
                <Wrapper>
                    <div className={styles.productsTitleCategoryContainer}>
                        <h1 id={id} className={styles.productsTitle}>Выбирай напиток</h1>
                        <div ref={categoryRef} className={styles.productsCategoryWrapper}>
                            <div
                                onClick={(e) => clickCategory(e)}
                                className={styles.productsCategoryContainer}
                                style={{ borderRadius: isExpandCategory ? '13px 13px 0 0' : '13px' }}
                            >
                                <p>{category}</p>
                                <div className={
                                    hasClicked
                                        ? (isExpandCategory
                                            ? styles.productsCategoryArrowBottomContainer
                                            : styles.productsCategoryArrowTopContainer)
                                        : ''
                                }>
                                    <KeyboardArrowDownIcon />
                                </div>
                            </div>

                            {isExpandCategory && 
                                <div className={styles.productsCategoryListContainer}>
                                    <ul className={styles.productsCategoryList}>
                                        {categoriesList.map((item, index) => (
                                        <li
                                            key={index}
                                            onClick={() => clickSelectCategory(item)}
                                            className={`${item !== category
                                            ? styles.productsCategoryItem
                                            : styles.productsCategoryItem__selected}`}
                                        >
                                            {item} {item === category && <CheckIcon sx={{ fontSize: '20px' }} />}
                                        </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                    <div className={styles.products}>
                        {!event ? 
                            //!mounted || loading ?
                            (<div className={styles.productsContent}>
                                {arrayElementsSkeleton.map((s, index) => (
                                    <Skeleton 
                                        key={index}
                                        variant="rectangular"
                                        height={484}
                                        sx={{borderRadius: '13px',
                                            flex: '0 0 calc((100% - 2 * 36px) / 3)', // 👈 фиксированная ширина
                                            boxSizing: 'border-box',
                                            animationDuration: '1.25s',
                                            bgcolor: 'rgb(0 0 0 / 8%)',
                                        }}
                                        animation="pulse"
                                    />
                                ))}
                            </div>) :
                            (<div>
                                {sortingCocktails.length === 0 ?
                                    (<div className={styles.productsEmptyListTextContainer}>
                                        <p>Список пуст</p>
                                    </div>)
                                    : 
                                    (<div className={`${styles.productsContent} ${mountedOnce ? styles.fadeIn : ''}`}>
                                        {sortingCocktails.map((cocktail, index) => (
                                            <ProductsCard hide={true} index={index} key={`${cocktail.id}-${category}`} id={cocktail.id} name={cocktail.name} image={cocktail.imageUrl} ingredients={cocktail.ingredients} type={cocktail.type} event={event} selectedProducts={selectedProducts} onAddProduct={onAddProduct} onRemoveProduct={onRemoveProduct} isAuthor={cocktail.isAuthor} />
                                        ))}
                                    </div>)
                                }
                            </div>)
                        }
                        <div className={styles.productsContentButtonContainer}>
                            <Button onClick={() => navigate('/cocktails')} disabled={!event} sx={{width: '170px', borderRadius: '21px', backgroundColor: '#8ac640', textTransform: "none", whiteSpace: "nowrap", fontSize: '16px', boxShadow: 'none', '@media (max-width: 768px)': {marginBottom: '35px'}, }} variant="contained">{event ? 'Показать больше' : 'Загрузка...'}</Button>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}

export default Products;