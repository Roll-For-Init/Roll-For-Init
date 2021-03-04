import { LOADING_ON, LOADING_OFF } from '../actions/types';

const initialState = { isAppLoading: true, awaiting: ['app'] };

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

    default:
      return state;
  }
}
