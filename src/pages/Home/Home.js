import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import {useNavigate, useNavigationType, useLocation} from 'react-router-dom';

import { useDisableScrollRestoration } from "../../hooks/useDisableScrollRestoration";
import styles from './Home.module.scss';
import { months } from '../../data/months';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Hero from '../../components/Hero/Hero';
import Instructions from '../../components/Instructions/Instructions';
import Categories from '../../components/Categories/Categories';
import Products from '../../components/Products/Products';
import PartyInfo from '../../components/PartyInfo/PartyInfo';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';




const Home = ({cocktails, onHandleScroll, event, loadingEvent, isProductInListSelected, selectedProducts, onAddProduct, onRemoveProduct, showSuccessfulNotification, onSwitchSuccessfulNotification}) => {
  useDisableScrollRestoration();


  const location = useLocation();

  const navigate = useNavigate();

  const navigationType = useNavigationType();





  const sectionRef = useRef(null);

  const handleScroll = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  // 

  // const listSelectedProducts = JSON.parse(localStorage.getItem('selectCocktail') || '[]');

  // const [quantityInListSelectedProducts, setQuantityInListSelectedProducts] = useState(listSelectedProducts.length);

  // const changeQuantitySelectedProducts = (quantity) => {
  //   setQuantityInListSelectedProducts(quantity);
  // }

  // const isProductInListSelected = quantityInListSelectedProducts > 0;

  const clickToBasketPage = () => {
    navigate('/basket');
  }

  // 

useLayoutEffect(() => {
  if (!location.state?.scrollTo) return;

  const scrollTo = location.state.scrollTo;

  if (scrollTo === "bottom") {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
  } else if (scrollTo === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const el = document.getElementById(scrollTo);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y - 50, behavior: "smooth" });
    }
  }

  // ✅ всегда очищаем state, чтобы эффект не зацикливался
  navigate(".", { replace: true, state: {} });
}, [location, navigate]);

    
  // 

  const timeParty = event?.time || '';
  const dateParty = event?.date || '';

  const formatDateRu = (iso) => {
    if(!iso) return '';
    const [_, m, d] = iso.split('-');
    return `${d.padStart(2, '0')} ${months[Number(m) - 1]}`;
  }


  // 






//   useLayoutEffect(() => {
//   if (location.state?.scrollTo) {
//     if (location.state.scrollTo === "bottom") {
//       // 👉 если явно указали "bottom" — скроллим вниз
//       window.scrollTo({
//         top: document.body.scrollHeight,
//         behavior: "instant"
//       });
//     } else {
//       // 👉 иначе ищем элемент по id
//       const el = document.getElementById(location.state.scrollTo);
//       if (el) {
//         const y = el.getBoundingClientRect().top + window.scrollY;
//         window.scrollTo({
//           top: y - 50,
//           behavior: "smooth"
//         });
//       }
//     }

//     // очищаем state, чтобы скролл не повторялся
//     navigate(".", { replace: true });
//   }
// }, [location, navigate]);






    return (
        <div className={styles.home}>
            {showSuccessfulNotification &&
              (<div className={styles.homeAlertContainer}>
                <Box sx={{ maxWidth: '895px', width: '100%' }}>
                  <Collapse in={showSuccessfulNotification}>
                    <Alert
                      action={
                        <IconButton
                          sx={{marginLeft: '18px'}}
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            onSwitchSuccessfulNotification(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      }
                      sx={{
                        bgcolor: "rgb(200, 235, 200)",
                        mb: 2,
                        fontSize: "16px",
                        display: "flex",
                        minHeight: "40px",
                        alignItems: 'stretch',
                        "& .MuiAlert-action": {
                          padding: 0,         // убираем дефолтные отступы
                          marginLeft: "auto", // уводим крестик максимально вправо
                          alignItems: "center",
                        },
                      }}
                    >Успешно подтверждено! Жду тебя в {!timeParty ? <Skeleton sx={{ display: "inline-block", verticalAlign: "middle", transform: "scale(1, 0.9)", bgcolor: "rgb(160, 210, 160)", "& .MuiSkeleton-wave": {animationDuration: "0.2s",}}} variant="text" width={41} height={20} animation="wave" /> : timeParty}, {!dateParty ? <Skeleton sx={{ display: "inline-block", verticalAlign: "middle", transform: "scale(1, 0.9)", bgcolor: "rgb(160, 210, 160)", "& .MuiSkeleton-wave": {animationDuration: "0.2s",}}} variant="text" width={85} height={20} animation="wave" /> : formatDateRu(dateParty)}</Alert>
                  </Collapse>
                </Box>
              </div>)
            }

            <Hero onHandleScroll={handleScroll} />
            <Instructions />
            <Categories />
            <Products id="products" cocktails={cocktails} event={event} sectionRef={sectionRef} selectedProducts={selectedProducts} onAddProduct={onAddProduct} onRemoveProduct={onRemoveProduct} />
            <PartyInfo id="last-details" event={event} loadingEvent={loadingEvent} formatDateRu={formatDateRu} />
            {isProductInListSelected && <div onClick={clickToBasketPage} className={styles.homeBasketContainer}><ShoppingCartIcon sx={{fontSize: '30px', color: 'white'}} /></div>}
        </div>
    )
}

export default Home;