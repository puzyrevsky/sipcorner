import React, {useState, useEffect, useRef} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { db } from './firebase';
import {
  collection,
  query,
  limit,
  onSnapshot,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';

import logo from './logo.svg';
import './App.css';

import Home from './pages/Home/Home';
import LoginPage from './pages/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AdminPage from './pages/AdminPage/AdminPage';
import Basket from './pages/Basket/Basket';
import Catalog from './pages/Catalog/Catalog';
import UserDrinks from './pages/UserDrinks/UserDrinks';
import NotFound from "./pages/NotFound/NotFound";

const FIVE_MIN = 5 * 60 * 1000;

function App() {

const [cocktails, setCocktails] = useState([]);

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
            } finally {
                // setLoading(false);
            }
        }; 

        fetchCocktails();
    }, []);

// 

  const [event, setEvent] = useState(null);

  const [loadingEvent, setLoadingEvent] = useState(true);

  
  const finalTimerRef = useRef(null);
  const archivingRef = useRef(false);


  useEffect(() => {
    const q = query(collection(db, 'event'), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      const d = snap.docs[0];
      // const data = snap.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setEvent(d ? {id: d.id, ...d.data()} : {});
      setLoadingEvent(false);
    }, 
    (err) => {
      console.error(err);
      setEvent({});
      setLoadingEvent(false);
    });

    return unsub;
  }, []);



  const clearTimer = () => {
    if (finalTimerRef.current) {
      clearTimeout(finalTimerRef.current);
      finalTimerRef.current = null;
    }
  };

  const archiveNow = async (evt) => {
    if (!evt || archivingRef.current) return;
    archivingRef.current = true;
    try {
      const batch = writeBatch(db);
      const srcRef = doc(db, 'event', evt.id);
      const dstRef = doc(db, 'historyEvent', evt.id);
      const { id, ...rest } = evt;

      batch.set(dstRef, { ...rest, archivedAt: serverTimestamp() }, { merge: true });
      batch.delete(srcRef);

      await batch.commit();
      console.log('Архивировано и удалено:', evt.id);
    } catch (e) {
      console.error('Не удалось архивировать:', e);
      archivingRef.current = false; // позволим повторить при следующей проверке
    } finally {
      clearTimer();
    }
  };

  const scheduleArchive = (evt) => {
    clearTimer();
    if (!evt) return;

    const delAt = evt.timeStampDeleteToHistory;
    if (typeof delAt !== 'number') return;

    const msLeft = delAt - Date.now();

    if (msLeft <= 0) {
      // дедлайн прошёл — сразу
      archiveNow(evt);
    } else if (msLeft <= FIVE_MIN) {
      // до дедлайна ≤ 5 минут — ставим один короткий таймер
      finalTimerRef.current = setTimeout(() => archiveNow(evt), msLeft);
    } else {
      // до дедлайна > 5 минут — НИЧЕГО НЕ ДЕЛАЕМ
      // дождёмся захода/фокуса пользователя ближе к времени и проверим ещё раз
    }
  };

  // пересчитываем при каждом новом event
  useEffect(() => {
    archivingRef.current = false;
    scheduleArchive(event);
    return clearTimer;
  }, [event]);

  // подстраховка: при возврате во вкладку/фокусе пересчитываем
  useEffect(() => {
    const onWake = () => scheduleArchive(event);
    window.addEventListener('focus', onWake);
    document.addEventListener('visibilitychange', onWake);
    return () => {
      window.removeEventListener('focus', onWake);
      document.removeEventListener('visibilitychange', onWake);
    };
  }, [event]);


  // 

  const [selectedProducts, setSelectedProducts] = useState(() => {
    try {
        const stored = JSON.parse(localStorage.getItem('selectCocktail'));
        return Array.isArray(stored) ? stored : [];
    } catch {
        return [];
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectCocktail', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const addProduct = (id) => {
    if(!selectedProducts.includes(id)){
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p !== id));
    
  }

  const clearProducts = () => {
    setSelectedProducts([]);
  }

  const isProductInListSelected = selectedProducts.length > 0;

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "selectCocktail") {
        try {
          const updated = JSON.parse(e.newValue) || [];
          setSelectedProducts(Array.isArray(updated) ? updated : []);
        } catch {
          setSelectedProducts([]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  // 

  useEffect(() => {
    if(!loadingEvent) {
      if(!event || Object.keys(event).length === 0) {
        localStorage.removeItem('selectCocktail');
        setSelectedProducts([]);
      }
    }
  }, [loadingEvent, event]);


  // 

  const replaceProducts = (ids) => {
    if (Array.isArray(ids)) {
      setSelectedProducts(ids);
    } else {
      setSelectedProducts([]);
    }
  };


  // 

  const [showSuccessfulNotification, setShowSuccessfulNotification] = useState(false);

  const switchSuccessfulNotification = (value) => {
    setShowSuccessfulNotification(value);
  };

  

  useEffect(() => {
    let timeout;

    if(showSuccessfulNotification) {
      timeout = setTimeout(() => {
        setShowSuccessfulNotification(false);
      }, 7000); // ! 5000
    }

    return () => clearTimeout(timeout);
  }, [showSuccessfulNotification]);


 
  return (
    <div className="App">
        <Routes>
          <Route path='/' element={<Home cocktails={cocktails} event={event} loadingEvent={loadingEvent} isProductInListSelected={isProductInListSelected} selectedProducts={selectedProducts} onAddProduct={addProduct} onRemoveProduct={removeProduct} showSuccessfulNotification={showSuccessfulNotification} onSwitchSuccessfulNotification={switchSuccessfulNotification} />} />
          <Route path='/cocktails' element={<Catalog cocktails={cocktails} event={event} isProductInListSelected={isProductInListSelected} selectedProducts={selectedProducts} onAddProduct={addProduct} onRemoveProduct={removeProduct} />} />
          <Route path='/drinks/:idPerson/:idCocktail' element={<UserDrinks />} />
          <Route path='/basket' element={<Basket selectedProducts={selectedProducts} onClearProducts={clearProducts} onRemoveProduct={removeProduct} onSwitchSuccessfulNotification={switchSuccessfulNotification} onReplaceProducts={replaceProducts} />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin' element={<PrivateRoute><AdminPage event={event} /></PrivateRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
  );
}

export default App;
