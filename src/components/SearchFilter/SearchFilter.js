import React, {useState, useEffect} from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const SearchFilter = ({currentItems}) => {

    const [searchText, setSearchText] = useState('');


    useEffect(() => {
        console.log(currentItems.filter((i) => searchText === i.name));
    }, [searchText]);

    

    return (
        <div>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
                noValidate
                autoComplete="off"
            >
                <TextField onChange={(e) => setSearchText(e.target.value)} value={searchText} sx={{borderRadius: '13px'}} id="outlined-basic" label="Поиск" variant="outlined" />
            </Box>
        </div>
    )
}

export default SearchFilter;