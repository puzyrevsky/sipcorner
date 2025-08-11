import { useState, useRef, useEffect, useMemo } from 'react';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';

import styles from './Products.module.scss';

import Wrapper from '../Wrapper/Wrapper';

import waveImage from '../../image/wave.png';
import ProductsCard from '../ProductCard/ProductCard';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';



const Products = ({sectionRef}) => {

    const [cocktails, setCocktails] = useState([]);


    const categoriesList = [
        'Все',
        'Алкогольный',
        'Безалкогольный',
        'Шот',
    ]

    // const [sortingCocktails, setSortingCocktails] = useState([]);


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
        <div className={styles.products} ref={sectionRef}>
            <img src={waveImage} alt='' className={styles.wave} />
            <div className={styles.productsContentContainer}>
                <Wrapper>
                    <div className={styles.productsTitleCategoryContainer}>
                        <h1 className={styles.productsTitle}>Выбирай напиток</h1>
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
                        <div className={styles.productsContent}>
                            {sortingCocktails.map((cocktail) => (
                                <ProductsCard key={cocktail.id} name={cocktail.name} image={cocktail.imageUrl} ingredients={cocktail.ingredients} type={cocktail.type} />
                            ))}
                            {/* <ProductsCard type="алкогольный" />
                            <ProductsCard type="безалкогольный" />
                            <ProductsCard type="шот" /> */}
                            {/* <ProductsCard type="безалкогольный" /> */}
                        </div>
                        <div className={styles.productsContentButtonContainer}>
                            <Button sx={{borderRadius: '21px', backgroundColor: '#8ac640', textTransform: 'capitalize', fontSize: '16px', boxShadow: 'none',}} variant="contained">Показать больше</Button>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </div>
    )
}

export default Products;