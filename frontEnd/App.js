import React from 'react';
import Navigation from './navigation';
import pseudo from './reducer.pseudo';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({pseudo}));

console.disableYellowBox = true;
export default function App() {
  return (
    <Provider store={store}>
       <Navigation/>
    </Provider>
   
  );
}
