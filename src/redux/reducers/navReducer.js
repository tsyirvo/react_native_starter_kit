import AppNavigator from 'routes/routes';

export default function navReducer(state, action) {
  const newState = AppNavigator.router.getStateForAction(action, state);

  return newState || state;
}
