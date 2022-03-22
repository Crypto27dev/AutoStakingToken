import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk)
));
// const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
