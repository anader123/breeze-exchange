import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducer';

const loggerMiddleware = createLogger();
const middleware = [];

// Redux Dev Tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function store(preloadedState) {
    return createStore(
        rootReducer,
        preloadedState,
        composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
    );
};
