import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import {useNavigate, useLocation, useParams, useNavigationType } from 'react-router-dom';


import { db } from '../../firebase';
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';

import styles from './UserDrinks.module.scss';

import Wrapper from '../../components/Wrapper/Wrapper';

import CombinedHistoryImage from '../../components/CombinedHistoryImage/CombinedHistoryImage';

import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import backgroundImageOne from '../../image/backgroundHistory1.png';
import backgroundImageTwo from '../../image/backgroundHistory2.png';
import backgroundImageThree from '../../image/backgroundHistory3.png';
import backgroundImageFour from '../../image/backgroundHistory4.png';
import backgroundImageFive from '../../image/backgroundHistory5.png';

import manAva from '../../image/manAva.png';
import womanAva from '../../image/womanAva.png';

import stubImageHistory from '../../image/stub-image-cocktail-history.png';



const UserDrinks = ({}) => {

    const [people, setPeople] = useState([]);

    // 

    const [isPaused, setIsPaused] = useState(false);


    //

    const navigate = useNavigate();

useEffect(() => {
  const handlePopState = () => {
    // если хочешь всегда вниз
    navigate("/", { state: { scrollTo: "bottom" } });

    // или если хочешь именно к секции "last-details"
    // navigate("/", { replace: true, state: { scrollTo: "last-details" } });
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [navigate]);


    const {idPerson, idCocktail} = useParams();

    
    // 



    const [currentIndexInUserList, setCurrentIndexInUserList] = useState(0);
    const [currentCocktailIndex, setCurrentCocktailIndex] = useState(0);

    
    const currentUser = people[currentIndexInUserList];

    // console.log('people:', people);


    const listIdCocktail = currentUser?.drinks?.map(drink => drink.id) || [];

    const [valueProgress, setValueProgress] = useState(0);

    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [firstImageLoaded, setFirstImageLoaded] = useState(false);

// сброс мгновенно при переключении (до рендера)
useLayoutEffect(() => {
  setValueProgress(0);
}, [currentCocktailIndex, currentUser]);

const handleImageLoad = () => {
  setIsImageLoaded(true);
  setFirstImageLoaded(true);
};


// анимация запускается после сброса
const isPausedRef = useRef(false);

useEffect(() => {
  isPausedRef.current = isPaused;
}, [isPaused]);

useEffect(() => {
  if (!currentUser || !isImageLoaded) return;

  let frame;
  let cancelled = false;
  let start = Date.now();
  let pausedAt = null;
  let elapsedBeforePause = 0;
  const duration = 3000;

  const animate = () => {
    if (cancelled) return;

    if (isPausedRef.current) {
      if (!pausedAt) pausedAt = Date.now();
      frame = requestAnimationFrame(animate);
      return;
    }

    if (pausedAt) {
      elapsedBeforePause += Date.now() - pausedAt;
      pausedAt = null;
    }

    const elapsed = Date.now() - start - elapsedBeforePause;
    const progress = Math.min((elapsed / duration) * 100, 100);
    setValueProgress(progress);

    if (progress < 100) {
      frame = requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        if (!cancelled) {
          setValueProgress(0);
          switchingNextUserDrinks();
        }
      }, 200);
    }
  };

  frame = requestAnimationFrame(animate);

  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
}, [currentCocktailIndex, currentUser, isImageLoaded]); // ⬅️ без isPaused


// 


const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 576);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

// для свайпов
const touchStart = useRef({ x: 0, y: 0, time: 0 });
const ignoreClick = useRef(false);

const handleTouchStart = (e) => {
  setIsPaused(true);
  touchStart.current = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
    time: Date.now(), // фиксируем время начала
  };
};



const handleTouchEnd = (e) => {
  setIsPaused(false);

  const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
  const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
  const pressTime = Date.now() - touchStart.current.time;

  const isSwipeX = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY);
  const isSwipeY = deltaY < -80 && Math.abs(deltaY) > Math.abs(deltaX);

  if (isSwipeX) {
    if (deltaX < 0) {
      if (currentIndexInUserList < people.length - 1) {
        setCurrentIndexInUserList((prev) => prev + 1);
        setCurrentCocktailIndex(0);
      } else {
        navigate("/", { state: { scrollTo: "bottom" } });
      }
    } else {
      if (currentIndexInUserList > 0) {
        setCurrentIndexInUserList((prev) => prev - 1);
        setCurrentCocktailIndex(0);
      }
    }
    ignoreClick.current = true; // свайп → блокируем click
  } else if (isSwipeY) {
    navigate("/", { state: { scrollTo: "bottom" } });
    ignoreClick.current = true;
  } else if (pressTime > 200) {
    // долго держали → была пауза, клик не нужен
    ignoreClick.current = true;
  } else {
    // короткий тап → разрешаем click
    ignoreClick.current = false;
  }
};


// для тапа по экрану
const handleClick = (e) => {
  if (ignoreClick.current) return; // блокируем click после паузы/свайпа
  if (!isMobile) return;

  const { clientX } = e;
  const middle = window.innerWidth / 2;

  if (clientX > middle) {
    switchingNextUserDrinks();
  } else {
    switchingBackUserDrinks();
  }
};


// 

    useEffect(() => {
        if (currentUser?.id && listIdCocktail.length > 0) {
            navigate(`/drinks/${currentUser.id}/${listIdCocktail[currentCocktailIndex]}`);
        }
    }, [currentUser, currentCocktailIndex, navigate]);


    const switchingNextUserDrinks = () => {
        if(!currentUser) {
            return;
        }

        if(currentCocktailIndex < listIdCocktail.length - 1) {
            setCurrentCocktailIndex(prev => prev + 1);
        } else {
            if(currentIndexInUserList < people.length - 1) {
                setCurrentIndexInUserList(prev => prev + 1);
                setCurrentCocktailIndex(0);
            } else {
                navigate("/", { state: { scrollTo: "bottom" } });
            }
        }  
    };

    const switchingBackUserDrinks = () => {
        if(!currentUser) {
            return;
        }

        if(currentCocktailIndex > 0) {
            setCurrentCocktailIndex(prev => prev - 1);
        } else {
            if(currentIndexInUserList > 0) {
                setCurrentIndexInUserList(prev => prev - 1);
                setCurrentCocktailIndex(0);
            } else {
                setCurrentCocktailIndex(0);
                setCurrentIndexInUserList(0);
            }
        }  
    };


    // 

    const listBackground = [backgroundImageOne, backgroundImageTwo, backgroundImageThree, backgroundImageFour, backgroundImageFive];


    // 

    const NINETY_MINUTES_TO_GO = 90 * 60 * 1000;

    const [isEditable, setIsEditable] = useState(true);

    const [editableUntilMs, setEditableUntilMs] = useState(null);


    useEffect(() => {
        if (!editableUntilMs) return;

        const check = () => {
            const nowMs = Date.now();
            if (nowMs > editableUntilMs) {
            setIsEditable(false);
            }
        };

        const interval = setInterval(check, 1000); 
        check(); // проверить сразу

        return () => clearInterval(interval);
    }, [editableUntilMs]);

    // 

    useEffect(() => {
        document.body.classList.add("userdrinks-background");
        return () => {
            document.body.classList.remove("userdrinks-background");
        };
    }, []);




    useEffect(() => {
        const fetchPeople = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'event'));
                const firstDoc = snapshot.docs[0];

                if(firstDoc.exists()) {
                    const data = firstDoc.data();

                    // 

                    const [year, month, day] = data.date.split("-").map(Number);
                    const [hours, minutes] = data.time.split(":").map(Number);

                    const dateTime = new Date(year, month - 1, day, hours, minutes, 0); // локальное время
                    const eventStartMs = dateTime.getTime();

                    setEditableUntilMs(eventStartMs - NINETY_MINUTES_TO_GO);

                    // 

                    const verifiedPeople = data.people || [];

                    const id = verifiedPeople.findIndex(item => item.id === idPerson);

                    if(id === -1) {
                        setPeople(verifiedPeople);
                    } else {
                        const copyPeople = [...verifiedPeople];
                        const [foundPerson] = copyPeople.splice(id, 1);

                        const idCoc = foundPerson.drinks.findIndex(drink => drink.id === idCocktail);

                        if(idCoc !== -1) {
                            const [selectCocktail] = foundPerson.drinks.splice(idCoc, 1);
                        
                            foundPerson.drinks = [selectCocktail, ...foundPerson.drinks];
                        }

                        setPeople([foundPerson, ...copyPeople]);
                    }
                }
            } catch (err) {
                console.error("Ошибка загрузки people:", err);
                alert("Ошибка загрузки people:", + err);
            } finally {

            }
        }

        fetchPeople();
    }, []);


    // 

    const [cardWidth, setCardWidth] = useState(null);


    // 

    const avatar = people[currentIndexInUserList]?.gender === 'мужской' ? manAva : womanAva;




    useEffect(() => {
        const setVh = () => {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        };

        setVh();
        window.addEventListener('resize', setVh);

        return () => window.removeEventListener('resize', setVh);
    }, []);


    // 



    return (
        <div className={styles.userDrinks}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={(e) => {
                setIsPaused(true);
                handleTouchStart(e);
            }}
            onTouchEnd={(e) => {
                setIsPaused(false);
                handleTouchEnd(e);
            }}
            onClick={handleClick}
        >
            {isImageLoaded && people[currentIndexInUserList - 1] && (
                <div className={styles.userDrinksPreviousStoryContainer}>
                    <div className={styles.userDrinksPreviousStoryBlurred}>
                        <img src={listBackground[people[currentIndexInUserList - 1]?.drinks?.[0]?.indexImageBackgroundHistory]} alt='' />
                    </div>
                    <div className={styles.userDrinksInactiveStoryInfoPerson}>
                        <img src={people[currentIndexInUserList - 1]?.gender === 'мужской' ? manAva : womanAva} alt='' className={styles.userDrinksInactiveStoryAvatar} />
                        <p>{people[currentIndexInUserList - 1]?.name}</p>
                    </div>
                </div>
            )}
            {isImageLoaded && people[currentIndexInUserList + 1] && (
                <div className={styles.userDrinksNextStoryContainer}>
                    <div className={styles.userDrinksNextStoryBlurred}>
                        <img src={listBackground[people[currentIndexInUserList + 1]?.drinks?.[0]?.indexImageBackgroundHistory]} alt='' />
                    </div>
                    <div className={styles.userDrinksInactiveStoryInfoPerson}>
                        <img src={people[currentIndexInUserList + 1]?.gender === 'мужской' ? manAva : womanAva} alt='' className={styles.userDrinksInactiveStoryAvatar} />
                        <p>{people[currentIndexInUserList + 1]?.name}</p>
                    </div>
                </div>
            )}
            <Wrapper>
                {people.length !== 0 &&
                    <div
                        className={styles.userDrinksHistoryContainer}
                        style={{ width: cardWidth ? Math.min(cardWidth, 450) : undefined, }} // одинаковая ширина
                    >
                        {currentUser && isImageLoaded && !(currentCocktailIndex === 0 && people[0].id === currentUser.id) && <div onClick={switchingBackUserDrinks} className={`${styles.userDrinksButtonTransition__back}`}>
                            <div className={`${styles.userDrinksButtonTransitionToOtherHistory}`}>
                                <KeyboardArrowLeftIcon sx={{color: '#ffffffa8'}} />
                            </div>
                        </div>}
                        {currentUser && isImageLoaded && !(currentCocktailIndex === listIdCocktail.length - 1 && people[people.length - 1].id === currentUser.id) && <div onClick={switchingNextUserDrinks} className={`${styles.userDrinksButtonTransition__next}`}>
                            <div className={`${styles.userDrinksButtonTransitionToOtherHistory}`}>
                                <KeyboardArrowRightIcon sx={{color: '#ffffffa8'}} />
                            </div>
                        </div>}
                        {cardWidth && (
                            <div
                                className={styles.userDrinksHistoryNamePersonContainer}
                                style={{ visibility: firstImageLoaded ? "visible" : "hidden" }}
                            >
                                <div className={styles.userDrinksHistoryNamePersonAvatarContainer}>
                                    <img src={avatar} alt="ava" className={styles.userDrinksHistoryNamePersonAvatar} />
                                    <p className={styles.userDrinksHistoryNamePersonText}>
                                        {people[currentIndexInUserList]?.name}
                                    </p>
                                </div>
                                <div className={styles.userDrinksHistoryButtonContainer}>
                                    {isEditable && (
                                        <EditIcon onClick={(e) => {
                                                e.stopPropagation();
                                                navigate("/basket", { state: { edit: true } });
                                            }} sx={{marginRight: '18px', color: '#ababab', cursor: 'pointer', transition: '.45s', '&:hover': {opacity: '0.57', transition: '.45s'}}} 
                                        />
                                    )}
                                    <CloseIcon onClick={(e) => {
                                            e.stopPropagation();
                                            navigate("/", { state: { scrollTo: "bottom" } });
                                        }} sx={{color: '#e9e9e9', cursor: 'pointer', transition: '.45s', '&:hover': {opacity: '0.57', transition: '.45s'}}} 
                                    />
                                </div>
                                <div className={styles.userDrinksHistoryProgressContainer}>
                                    {(listIdCocktail || []).map((line, index) => (
                                        <LinearProgress
                                        key={index}
                                        variant="determinate"
                                        value={
                                            index < currentCocktailIndex
                                            ? 100
                                            : index === currentCocktailIndex
                                            ? (valueProgress < 1 ? 0 : valueProgress)
                                            : 0
                                        }
                                        sx={{
                                            flex: 1,
                                            transition: "none",
                                            height: "3px",
                                            "&:not(:last-child)": { marginRight: "8px" },
                                            backgroundColor: "rgb(120, 139, 122)",
                                            "& .MuiLinearProgress-bar": {
                                            transition: "none",
                                            backgroundColor: "#72cb7c",
                                            },
                                        }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <CombinedHistoryImage
                            background={
                                listBackground[
                                    currentUser?.drinks?.[currentCocktailIndex]?.indexImageBackgroundHistory
                                ]
                            }
                            cocktail={currentUser?.drinks?.[currentCocktailIndex]?.imageUrl === '/static/media/stub-image-cocktail.e10c3418bf1b333d6ba2.png' ? stubImageHistory : currentUser?.drinks?.[currentCocktailIndex]?.imageUrl}
                            isStub={currentUser?.drinks?.[currentCocktailIndex]?.imageUrl === '/static/media/stub-image-cocktail.e10c3418bf1b333d6ba2.png'}
                            x={50}
                            y={80}
                            title={currentUser?.drinks?.[currentCocktailIndex]?.title}
                            titleX={currentUser?.drinks?.[currentCocktailIndex]?.coordinatesTitleHistoryX}
                            titleY={currentUser?.drinks?.[currentCocktailIndex]?.coordinatesTitleHistoryY}
                            onWidth={(w) => setCardWidth(w)} // ловим ширину
                            onImageLoad={handleImageLoad}
                        />
                    </div>
                }
            </Wrapper>
        </div>
    )
}

export default UserDrinks;