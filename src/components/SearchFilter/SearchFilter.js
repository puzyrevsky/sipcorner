import React, {useState, useEffect} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const SearchFilter = ({sortingCocktails, handleFoundItem, handleQuantityIntroducedSymbols, handleBanAnimationOpenProductCard}) => {

    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        handleQuantityIntroducedSymbols(searchText.length > 0);
        const copyFoundItem = sortingCocktails.filter((i) => i.name.toLowerCase().includes(searchText.toLocaleLowerCase()));
        console.log(copyFoundItem);
        handleFoundItem(copyFoundItem);
    }, [searchText]);

    

    return (
        <div>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField onChange={(e) => {
                    setSearchText(e.target.value);
                    handleBanAnimationOpenProductCard();
                }} value={searchText} sx={{borderRadius: '13px'}} id="outlined-basic" label="Поиск" variant="outlined" />
            </Box>
        </div>
    )
}

export default SearchFilter;