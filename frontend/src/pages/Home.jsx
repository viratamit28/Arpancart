import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import PopularProducts from '../components/PopularProducts';
import TrendingBanner from '../components/TrendingBanner';

const Home = () => {
  return (
    <main>
      <Hero />
      <Categories />
      <TrendingBanner />
      <PopularProducts />
    </main>
  );
};

export default Home;