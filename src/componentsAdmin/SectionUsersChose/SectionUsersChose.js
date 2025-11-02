// import { useState, useRef, useEffect } from 'react';

// import styles from './SectionUsersChose.module.scss';

// import Button from '@mui/material/Button';
// import TextField from '@mui/material/TextField';
// import ToggleButton from '@mui/material/ToggleButton';
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// import CloseIcon from '@mui/icons-material/Close';
// import Fab from '@mui/material/Fab';
// import AddIcon from '@mui/icons-material/Add';
// import LocalBarIcon from '@mui/icons-material/LocalBar';
// import NoDrinksIcon from '@mui/icons-material/NoDrinks';
// import WineBarIcon from '@mui/icons-material/WineBar';
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import CheckIcon from '@mui/icons-material/Check';

// import { addDoc, collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
// import { db } from '../../firebase'; // путь может отличаться



// const SectionUsersChose = () => {

// const [showSection, setShowSection] = useState(false);


//     return (
//         <div className={styles.sectionUsersChose} 
//             onClick={() => { if(!showSection) setShowSection(true)}}
//             style={{cursor: !showSection ? 'pointer' : 'default'}}
//         >
//             <div className={styles.sectionUsersChoseFormContainer} style={{margin: !showSection ? '18px 13px 18px 13px' : '18px 13px 0px 13px',}}>
//                 <div onClick={() => { if(showSection) setShowSection(false)}} className={styles.sectionUsersChoseTitleOpenContainer} style={{marginBottom: !showSection ? '0px' : '23px', borderBottom: !showSection ? 'none' : '1px solid rgba(128, 128, 128, 0.709)', paddingBottom: !showSection ? '0px' : '20px', cursor: showSection && 'pointer'}}>
//                     <p className={styles.sectionUsersChoseTitleOpenContainerText}>Гости выбрали</p>
//                     <div>
//                         {!showSection ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />)}
//                     </div>
//                 </div>
//                 {showSection && (
//                     <div className={styles.sectionUsersChoseContentContainer}>
//                         <p>hello</p>
//                     </div>)
//                 }
//             </div>
//         </div>
//     )
// }

// export default SectionUsersChose;


// 


import { useState, useRef, useEffect } from 'react';

import styles from './SectionUsersChose.module.scss';

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
import CheckIcon from '@mui/icons-material/Check';

import { addDoc, collection, doc, setDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase'; // путь может отличаться



const SectionUsersChose = () => {

    const [showSection, setShowSection] = useState(false);


    // 

    const [people, setPeople] = useState([]);

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'event'));

                if(snapshot.empty) {
                    return;
                }

                const firstDoc = snapshot.docs[0];

                if(firstDoc.exists()) {
                    const data = firstDoc.data();

                    setPeople(data.people);
                }
            } catch (err) {
                console.error("Ошибка загрузки people:", err);
                alert("Ошибка загрузки people:", + err);
            } finally {

            }
        }

        fetchPeople();
    }, []);



    return (
        <div className={styles.sectionUsersChose} 
            onClick={() => { if(!showSection) setShowSection(true)}}
            style={{cursor: !showSection ? 'pointer' : 'default'}}
        >
            <div className={styles.sectionUsersChoseFormContainer} style={{margin: !showSection ? '18px 13px 18px 13px' : '18px 13px 0px 13px',}}>
                <div onClick={() => { if(showSection) setShowSection(false)}} className={styles.sectionUsersChoseTitleOpenContainer} style={{marginBottom: !showSection ? '0px' : '23px', borderBottom: !showSection ? 'none' : '1px solid rgba(128, 128, 128, 0.709)', paddingBottom: !showSection ? '0px' : '20px', cursor: showSection && 'pointer'}}>
                    <p className={styles.sectionUsersChoseTitleOpenContainerText}>Гости выбрали <span className={styles.sectionUsersChoseTitleQuantityPeople}>{people.length}</span></p>
                    <div>
                        {!showSection ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />)}
                    </div>
                </div>
                {showSection && (
                    <div className={styles.sectionUsersChoseContentContainer}>
                        {people.length === 0 ?
                            (<p className={styles.sectionUsersChoseNoSelectedText}>Пока никто не сделал выбор</p>)
                            :
                            (<div>
                                {people.map((person) => (
                                    <div key={person.id} className={styles.sectionUsersChosePersonCardContainer}>
                                        <p>{person.name}</p>
                                        <ul>
                                            {person.drinks.map((drink) => (
                                                <li key={drink.id}>{drink.title} &nbsp;·&nbsp; {drink.quantity} шт.</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>)
                        }
                    </div>)
                }
            </div>
        </div>
    )
}

export default SectionUsersChose;