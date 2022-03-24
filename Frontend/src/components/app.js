import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Home from './pages/Home/HomePage';
import Dashboard from './pages/home';
import MintEarning from './pages/mintEarning';
import Explore from './pages/explore';
import RankingRedux from './pages/RankingRedux';
import ColectionList from './pages/colectionList';
import Colection from './pages/colection';
import ItemDetailRedux from './pages/ItemDetailRedux';
import Author from './pages/Author';
import Register from './pages/register';
import Create from './pages/create';
import Create2 from './pages/create2';
import Create3 from './pages/create3';
import Createoption from './pages/createOptions';
import EditItem from './pages/editItem';
import Activity from './pages/activity';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import MyCollection from './pages/MyCollection';
import Admin from './pages/admin';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const app = () => (
  <div className="wraper">
    <GlobalStyles />
    <PosedRouter>
      <ScrollTop path="/">
        <Home exact path="/">
          <Redirect to="/" />
        </Home>
        <Dashboard path="/dashboard" />
        <MintEarning path="/mint" />
        <Explore path="/explore" />
        <RankingRedux path="/ranking" />
        <ColectionList path="/collection/:categoryId" />
        <Colection path="/colection/:collectionId" />
        <ItemDetailRedux path="/ItemDetail/:nftId" />
        <Author path="/Author/:authorId" />
        <Register path="/register" />
        <Create path="/create" />
        <Create2 path="/create2" />
        <Create3 path="/create3" />
        <EditItem path="/edit_item/:nftId" />
        <Createoption path="/createOptions" />
        <Activity path="/activity" />
        <Profile path="/profile" />
        <EditProfile path="/edit_profile" />
        <MyCollection path="/my_collection" />
        <Admin path="/admin" />
      </ScrollTop>
    </PosedRouter>
    <ScrollToTopBtn />
  </div>
);
export default app;