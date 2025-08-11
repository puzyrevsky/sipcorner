import { useRef } from 'react';

import styles from './Home.module.scss';


import Hero from '../../components/Hero/Hero';
import Instructions from '../../components/Instructions/Instructions';
import Categories from '../../components/Categories/Categories';
import Products from '../../components/Products/Products';
import PartyInfo from '../../components/PartyInfo/PartyInfo';




const Home = ({onHandleScroll}) => {

      const sectionRef = useRef(null);
    
      const handleScroll = () => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

    return (
        <div>
            <Hero onHandleScroll={handleScroll} />
            <Instructions />
            <Categories />
            <Products sectionRef={sectionRef} />
            <PartyInfo />
        </div>
    )
}

export default Home;