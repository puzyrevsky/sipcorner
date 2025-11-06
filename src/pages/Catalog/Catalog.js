import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';

import styles from './Catalog.module.scss';

import Wrapper from '../../components/Wrapper/Wrapper';

import ProductsCard from '../../components/ProductCard/ProductCard';

import SearchFilter from '../../components/SearchFilter/SearchFilter';

import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';



const Catalog = ({cocktails, event, selectedProducts, onAddProduct, onRemoveProduct, isProductInListSelected}) => {

    const navigate = useNavigate();

    // const [cocktails, setCocktails] = useState([]);

    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { 
        setMounted(true); 
    }, []);


    const categoriesList = [
        'Все',
        'Алкогольный',
        'Безалкогольный',
        'Шот',
    ]


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
        handleIsSearching(selectedCategory);
        setCategory(selectedCategory);
        // clickCategory();
        handleCurrentPage(1);
    }


    // 

    


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


    // 

    const [listFoundItem, setListFoundItem] = useState([]);

    const handleFoundItem = (array) => {
        setListFoundItem(array);
    }

    const [quantityIntroducedSymbols, setQuantityIntroducedSymbols] = useState(0);

    // console.log(quantityIntroducedSymbols)

    const handleQuantityIntroducedSymbols = (boolean) => {
        setQuantityIntroducedSymbols(boolean);
    }


    // 

    const [listSortingJuice, setListSortingJuice] = useState([]);

    const resetSorting = () => {
        setListSortingJuice((prev) => prev.map((j) => ({...j, selected: false})));
        setCategory('Все');
        clickCategory();
    };


    const sortingCocktails = useMemo(() => {
        // if(category === 'Все') return cocktails;

        // return cocktails.filter((i) => (
        //     i.type.toLowerCase() === category.toLocaleLowerCase()
        // ));

        let result = category === 'Все' ? cocktails : cocktails.filter(cocktail => cocktail.type.toLowerCase() === category.toLowerCase());

        const selectedJuices = listSortingJuice
            .filter((j) => j.selected)
            .map((j) => j.juice.toLowerCase());

        if(selectedJuices.length > 0) {
            result = result.filter((cocktail) => cocktail.ingredients.some((ing) => selectedJuices.includes(ing.name.toLowerCase())));
        }

        return result;

    }, [cocktails, category, listSortingJuice]);



    const [currentPage, setCurrentPage] = useState(1);

    const itemPerPage = isWide ? 9 : 8;


    const currentItems = useMemo(() => {
        return quantityIntroducedSymbols 
            ? listFoundItem.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage)
            : sortingCocktails.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
    }, [quantityIntroducedSymbols, listFoundItem, sortingCocktails, currentPage, itemPerPage]);

    // 



    useEffect(() => {
        const juices = [];

        cocktails.forEach((cocktail) => {
            cocktail.ingredients.forEach((ing) => {

                const name = ing.name.toLowerCase();

                if(/(^|\s)сок($|\s)/i.test(name)) {
                    const juice = ing.name.trim();

                    const exists = juices.some(j => j.juice.toLowerCase() === juice.toLowerCase());

                    if(!exists) {
                        juices.push({juice, selected: false});
                    }
                }
            });
        });

        setListSortingJuice(juices);
    }, [cocktails]);


    
    
    

    const handleChecked = (e, index) => {
        // handleSearchText(''); // сброс строки поиска при нажатии на выбор сока
        handleCurrentPage?.(1);

        handleIsSearching(event);
        const newList = [...listSortingJuice];
        newList[index].selected = e.target.checked;
        setListSortingJuice(newList);
    }


    // 

    const [quantitySelectedFilters, setQuantitySelectedFilters] = useState(0);

    useEffect(() => {
        const filterCategoryCount = category !== 'Все' ? 1 : 0;

        const filterJuiceCount = listSortingJuice.reduce((acc, item) => acc + (item.selected ? 1 : 0), 0);

        setQuantitySelectedFilters(filterCategoryCount+filterJuiceCount);
    }, [category, listSortingJuice]);


    // 

    const handleCurrentPage = (value) => {
        setCurrentPage(value);
    }


    // 
    
    

    const totalPages = Math.ceil((quantityIntroducedSymbols ? listFoundItem.length : sortingCocktails.length) / itemPerPage);

    


    const arrayElementsSkeleton = [...Array(itemPerPage).keys()];
  

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


    // 

    const clickToBasketPage = () => {
        navigate('/basket');
    }


    // 

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'instant'});
    }, []);


    // 

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


    useEffect(() => {
        document.body.classList.add("catalog-background");

        return () => {
            document.body.classList.remove("catalog-background");
        };
    }, []);

    
    // 

    const [searchText, setSearchText] = useState('');

    const handleSearchText = (value) => {
        setSearchText(value);
    }


    useEffect(() => { 
        handleCurrentPage(1); 
    }, [quantityIntroducedSymbols, category]);

    // 

    const [isSearching, setIsSearching] = useState(false);

    const handleIsSearching = (value) => {
        setIsSearching(value);
    }




    return (
        <div className={styles.productsContainer}>
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
                                    {/* <p>{category}</p> */}
                                    <p>Сортировка</p>
                                    {quantitySelectedFilters !== 0 && (<span className={styles.productsQuantitySelectedCategory}>{quantitySelectedFilters}</span>)}
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
                                        <div style={{position: 'relative',}}>
                                            <p className={styles.productsCategoryTypeText}>Тип:</p>
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
                                            <p className={styles.productsCategoryTypeText}>Сок:</p>
                                            <ul className={styles.productsCategoryList}>
                                                {listSortingJuice.map((item, index) => (
                                                    <li key={index} className={`${!item.selected ? styles.productsCategoryItem : styles.productsCategoryItem__selected}`}>
                                                        <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: item.selected ? 'default' : 'pointer'}}>
                                                            <p className={`${!item.selected ? styles.productsCategoryNameText : styles.productsCategoryNameText__selected}`}>{item.juice}</p>
                                                            <Checkbox
                                                                checked={item.selected}
                                                                onChange={(e) => handleChecked(e, index)}
                                                                sx={{
                                                                    color: '#8ac640',               // цвет когда не выбран
                                                                    '&.Mui-checked': { color: '#8ac640' }, // цвет когда выбран
                                                                }}
                                                                size="small"
                                                            />
                                                        </label>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className={styles.productsCategoryResetSortingButton} onClick={() => resetSorting()}>
                                                <p>Сбросить</p>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <SearchFilter listFoundItem={listFoundItem} searchText={searchText} handleSearchText={handleSearchText} sortingCocktails={sortingCocktails} handleFoundItem={handleFoundItem} handleQuantityIntroducedSymbols={handleQuantityIntroducedSymbols} handleIsSearching={handleIsSearching} onHandleCurrentPage={handleCurrentPage} category={category} />
                        <div className={styles.products}>
                            { !event ? 
                            //!mounted || loading ?
                            (<div className={styles.productsContent}>
                                {arrayElementsSkeleton.map((s, index) => (
                                    <Skeleton
                                        key={index}
                                        variant="rectangular"
                                        height={484}
                                        sx={{
                                            borderRadius: '13px',
                                            width: '100%',
                                            animationDuration: '1.25s',
                                            bgcolor: 'rgb(0 0 0 / 8%)',
                                        }}
                                        animation="pulse"
                                    />
                                ))}
                            </div>) :
                            (<div>
                                {currentItems.length === 0 ?
                                    (<div className={styles.productsEmptyListTextContainer}>
                                        <p>Список пуст</p>
                                    </div>)
                                    :                            
                                    (<div className={`${styles.productsContent} ${!isSearching && mountedOnce ? styles.fadeIn : ''}`}>
                                        {currentItems.map((cocktail, index) => (
                                            <ProductsCard hide={false} searchText={searchText ?? ''} index={index} key={`${cocktail.id}-${category}`} id={cocktail.id} name={cocktail.name} image={cocktail.imageUrl} ingredients={cocktail.ingredients} type={cocktail.type} event={event} selectedProducts={selectedProducts} onAddProduct={onAddProduct} onRemoveProduct={onRemoveProduct} />
                                        ))}
                                    </div>)
                                }
                            </div>)}
                        </div>
                        <div className={styles.catalogPaginationContainer}>
                            <div style={{maxWidth: '895px',width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <Button onClick={() => navigate('/', { state: { scrollTo: "products" }})} sx={{width: '100px', padding: '3px 0', borderRadius: '21px', backgroundColor: '#8ac640', textTransform: 'capitalize', fontSize: '16px', boxShadow: 'none',}} variant="contained">Назад</Button>
                                <Pagination
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={(e, value) => {
                                        handleCurrentPage(value);
                                        window.scrollTo({ top: 0 }); // behavior: 'smooth' 
                                    }}
                                    siblingCount={1}
                                    boundaryCount={0}
                                    hidePrevButton
                                    hideNextButton
                                    sx={{
                                        alignItems: 'center',

                                        // общие стили для всех кнопок
                                        '& .MuiPaginationItem-root': {
                                            backgroundColor: '#8ac64033',
                                            color: '#4f4f4f',
                                            minWidth: '34px',
                                            height: '34px',
                                            borderRadius: '50%',
                                            fontSize: '15px',
                                            transition: 'all 0.2s ease',

                                            // адаптив под очень узкие экраны
                                            '@media (max-width: 350px)': {
                                                minWidth: '30px',
                                                height: '30px',
                                                fontSize: '13px',
                                            },
                                        },

                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            backgroundColor: '#8ac640',
                                            color: '#fff',
                                            fontWeight: 'bold',
                                            '&:hover': { backgroundColor: '#8ac640d9' },
                                        },

                                        '& .MuiPaginationItem-root:hover': {
                                            backgroundColor: '#8ac64063',
                                        },

                                        '& .MuiPaginationItem-ellipsis': {
                                            backgroundColor: '#8ac64033',
                                            borderRadius: '50%',
                                            width: '34px',
                                            height: '34px',
                                            lineHeight: '34px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#4f4f4f',
                                            fontWeight: 'bold',
                                            fontSize: '18px',

                                            // уменьшенная версия при <350px
                                            '@media (max-width: 350px)': {
                                                width: '30px',
                                                height: '30px',
                                                lineHeight: '30px',
                                                fontSize: '14px',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </Wrapper>
                </div>
                {isProductInListSelected && <div onClick={clickToBasketPage} className={styles.catalogBasketContainer}><ShoppingCartIcon sx={{fontSize: '30px', color: 'white'}} /></div>}
            </div>
        </div>
    )
}

export default Catalog;