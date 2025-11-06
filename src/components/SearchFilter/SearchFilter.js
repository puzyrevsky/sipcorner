import React, {useState, useEffect} from 'react';

import styles from './SearchFilter.module.scss';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';


const SearchFilter = (
    {
        listFoundItem, 
        searchText,
        handleSearchText,
        sortingCocktails, 
        handleFoundItem, 
        handleQuantityIntroducedSymbols, 
        handleIsSearching, 
        onHandleCurrentPage, 
        quantitySelectedFilters, 
        onChangeSelectedQuantityShowCardOnPage,
        itemPerPage
    }
) => {

    const handleChangeInput = (e) => {
        const value = e.target.value || ''; // если undefined, то пустая строка
        // запрещаем первый символ пробел
        if (value.length === 1 && value === ' ') return;

        handleSearchText(value);

        handleIsSearching(value.trim().length > 0); // теперь безопасно
    };


    useEffect(() => {
        const q = (searchText ?? '').toLowerCase();            // всегда строка
        handleQuantityIntroducedSymbols(q.length > 0);         // безопасно

        const copyFoundItem = (sortingCocktails ?? [])         // если undefined — делаем []
            .filter((i) => ((i?.name ?? '').toLowerCase()).includes(q)); // i.name -> строка

        handleFoundItem(copyFoundItem);
    }, [searchText, sortingCocktails]);


    // 

    const clearSearch = () => {
        handleSearchText('');
        handleIsSearching(false);
        onHandleCurrentPage?.(1); // сброс страницы
    };


    // 

    const hasSearchText = searchText.length > 0;
    const hasSelectedFilters = quantitySelectedFilters > 0;

    const shouldShowResultText = hasSearchText || hasSelectedFilters;

    

    return (
        <div className={styles.searchFilter}>
            <Box
                component="form"
                sx={{ '& > :not(style)': { margin: '8px 0', }}}
                noValidate
                autoComplete="off"
            >
                <div style={{ position: 'relative', width: '100%', }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Поиск"
                        onChange={handleChangeInput}
                        value={(searchText ?? '')}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchText && <CloseIcon
                                        onClick={clearSearch}
                                        style={{ cursor: 'pointer', color: '#9e9e9e', fontSize: '20'}}
                                        titleAccess="Очистить"
                                    />}
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '21px',
                                height: 44,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#e1e1e1',
                                    borderWidth: 2,
                                    borderRadius: '21px',
                                    transition: '.3s',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#cdcdcd', // настрои здесь нужный оттенок
                                    transition: '.3s',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#8ac640',
                                    borderWidth: 2,
                                },
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderRadius: '21px',
                            },
                            '& .MuiInputBase-input': {
                                padding: '6px 18px',
                                fontSize: 16,
                                lineHeight: 1.2,
                            },
                        }}
                    />
                </div>                                      
            </Box>
            <div className={styles.searchFilterResultTextContainer}>
                {shouldShowResultText && <p className={styles.searchFilterResultText}>Найдено: {listFoundItem.length}</p>}
                <span className={`${styles.searchFilterResultText} ${styles.searchTextShowQuantityCards}`} onClick={onChangeSelectedQuantityShowCardOnPage}>Показать по: {itemPerPage}</span>
            </div>   
        </div>
    )
}

export default SearchFilter;