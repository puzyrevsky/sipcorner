import { useState, useRef, useEffect } from 'react';

import styles from './SectionEvent.module.scss';

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



const SectionEvent = () => {

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    // const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    const SIX_HOURS_MS = 6 * 60 * 60 * 1000;


    const handleSave = async () => {

        if(!date || !time) return;

        const dateTime = new Date(`${date}T${time}:00`);
        const timeStampDeleteToHistory = dateTime.getTime() + SIX_HOURS_MS;

        try {
            const payload = {
                date,
                time,
                timeStampDeleteToHistory,
                people: [],
            }

            await addDoc(collection(db, "event"), payload);
            alert("Событие сохранено");
            setDate('');
            setTime('');
        } catch (error) {
            console.error(error);
            alert("Ошибка при сохранении. Смотри консоль.");
        }        
    }

    return (
        <div className={styles.sectionEvent}>
            <p className={styles.sectionEventTitle}>Добавить мероприятие</p>
            <div className={styles.sectionEventFormDateTimeContainer}>
                <div className={styles.sectionEventInputDateContainer}>
                    <p>Дата</p>
                    <TextField type='date' value={date} onChange={(e) => setDate(e.target.value)} id="outlined-basic" variant="outlined" />
                </div>
                <div className={styles.sectionEventInputTimeContainer}>
                    <p>Время</p>
                    <TextField type='time' value={time} onChange={(e) => setTime(e.target.value)} id="outlined-basic" variant="outlined" />
                </div>
            </div>
            <Button onClick={handleSave} variant="contained">Добавить мероприятие</Button>
        </div>
    )
}

export default SectionEvent;