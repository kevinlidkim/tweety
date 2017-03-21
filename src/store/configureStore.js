import { createStore, applyMiddleware, combineReducers  } from 'redux';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';

// export default function configureStore() {
//   return createStore(rootReducer, applyMiddleware(thunk));
// }

export default function configureStore() {

  return createStore(
      combineReducers({
        rootReducer,
        routing: routerReducer
      }), applyMiddleware(thunk)
    );
}
