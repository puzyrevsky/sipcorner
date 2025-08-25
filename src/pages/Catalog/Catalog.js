import { useState, useRef, useEffect, useMemo } from 'react';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';

import styles from './Catalog.module.scss';

import Wrapper from '../../components/Wrapper/Wrapper';

import ProductsCard from '../../components/ProductCard/ProductCard';

import waveImage from '../../image/wave.png';


import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import Skeleton from '@mui/material/Skeleton';



const Catalog = ({event, selectedProducts, onAddProduct, onRemoveProduct}) => {

    const [cocktails, setCocktails] = useState([]);


    const categoriesList = [
        'Все',
        'Алкогольный',
        'Безалкогольный',
        'Шот',
    ]


// 

    const arrayElementsSkeleton = [0, 1, 2];


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

    useEffect(() => {
        const fetchCocktails = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'cocktails'));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCocktails(data);
            } catch (error) {
                alert('Ошибка при загрузке коктейлей:', error);
            }
        }; 

        fetchCocktails();
    }, []);



    return (
        <div className={styles.products}>
            <div className={styles.productsContentContainer}>
                <Wrapper>
                    <div className={styles.productsTitleCategoryContainer}>
                        <h1 className={styles.productsTitle}>Полный список</h1>
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
                        (<div className={styles.productsContent}>
                            {arrayElementsSkeleton.map((s, index) => (
                                <Skeleton 
                                    key={index}
                                    variant="rectangular"
                                    width={274}
                                    height={484}
                                    sx={{borderRadius: '13px', animationDuration: '1.25s', margin: index === 0 || index === arrayElementsSkeleton.length - 1 ? '0' : '0 10px', bgcolor: 'rgb(0 0 0 / 8%)'}}
                                    animation="pulse"
                                />
                            ))}
                        </div>) :
                        (<div className={styles.productsContent}>
                            {sortingCocktails.map((cocktail, index) => (
                                <ProductsCard hide={false} index={index} key={cocktail.id} id={cocktail.id} name={cocktail.name} image={cocktail.imageUrl} ingredients={cocktail.ingredients} type={cocktail.type} event={event} selectedProducts={selectedProducts} onAddProduct={onAddProduct} onRemoveProduct={onRemoveProduct} />
                            ))}
                        </div>)}
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}

export default Catalog;