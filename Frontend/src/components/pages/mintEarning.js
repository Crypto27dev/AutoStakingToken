import React, { useState, useEffect, useCallback } from 'react';
import Reveal from 'react-awesome-reveal';
import { useSelector } from 'react-redux';
import Header from '../menu/header';
import Footer from '../components/footer';
import EarningInfo from '../components/EarningInfo';
import CarouselNFT from '../components/CarouselNFT';
import ClaimNft from '../components/ClaimNft';
import { getAllNFTInfos, getNFTCardInfos } from '../../web3/web3';
import { fadeInUp, fromWei } from '../../utils';
import * as selectors from '../../store/selectors';

const MintEarning = () => {
  const [refresh, setReload] = useState(false);
  const [nftInfos, setNftInfos] = useState(null);
  const [cardInfos, setCardInfos] = useState(null);
  const [cardPrices, setCardPrices] = useState(null);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);

  const getNFTInfos = useCallback(async () => {
    if (!web3) {
      console.log('[Wallet] = ', wallet, refresh);
      return;
    }
    const result = await getAllNFTInfos();
    console.log(result)
    if (result.success) {
      setNftInfos(result.nftInfos);
    }
  }, [web3, wallet, refresh]);

  const getCardInfos = useCallback(async () => {
    if (!web3) {
      console.log(refresh);
      return;
    }
    const result = await getNFTCardInfos();
    if (result.success) {
      let cardPriceArr = [], cardInfoArr = [];
      for (let i = 0; i < result.cardInfos.length; i++) {
        let card = result.cardInfos[i];
        const priceUSDT = fromWei(card.priceUSDT);
        card = { ...card, priceUSDT };
        cardPriceArr.push(priceUSDT);
        cardInfoArr.push(card);
      }
      setCardPrices(cardPriceArr);
      setCardInfos(cardInfoArr);
    }
  }, [web3, refresh]);

  useEffect(() => {
    getNFTInfos();
    getCardInfos();
  }, [getNFTInfos, getCardInfos]);

  return (
    <div>
      <Header />
      <section className='jumbotron breadcumb mint-banner' style={{ backgroundImage: `url('./img/background/mint_banner.png')` }}>
        <div className='mainbreadcumb'>
          <div className='container'>
            <div className='row m-10-hor'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
                <h1 className="banner-title">MINT & EARNING</h1>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className='py-5'>
        <EarningInfo onReload={() => setReload(prevState => !prevState)} nftInfos={nftInfos} cardInfos={cardInfos} />
      </section>

      <section className='py-0'>
        <CarouselNFT onReload={() => setReload(prevState => !prevState)} cardInfoArr={cardInfos} cardPriceArr={cardPrices} />
      </section>

      <section>
        <ClaimNft onReload={() => setReload(prevState => !prevState)} nftInfos={nftInfos} />
      </section>
      <Footer />
    </div>
  )
};
export default MintEarning;