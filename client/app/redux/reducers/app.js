import { LOADING_ON, LOADING_OFF, CACHE_URL } from '../actions/types';

const initialState = { isAppLoading: true, awaiting: ['app'], urls: null };

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOADING_ON:
      return {
        ...state,
        isAppLoading: true,
        awaiting: [...state.awaiting, payload],
      };
    case LOADING_OFF:
      return () => {
        const temp = state.awaiting.filter(task => task !== payload);
        return {
          ...state,
          isAppLoading: temp.includes('app'),
          awaiting: temp,
        };
      };
    case CACHE_URL:
      return {
        ...state,
        urls: {
          ...state.urls,
          ...payload,
        },
      };
    default:
      return state;
  }
}
