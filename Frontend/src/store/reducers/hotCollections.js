import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  hotCollections: initEntityState(null),
  newHotCollections: initEntityState(null),
  userHotCollections: initEntityState(null),
  oneCollection: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {

    case getType(actions.getHotCollections.request):
      return { ...state, hotCollections: entityLoadingStarted(state.hotCollections, action.payload) };
    case getType(actions.getHotCollections.success):
      return { ...state, hotCollections: entityLoadingSucceeded(state.hotCollections, action.payload) };
    case getType(actions.getHotCollections.failure):
      return { ...state, hotCollections: entityLoadingFailed(state.hotCollections) };
    case getType(actions.getUserHotCollections.request):
      return { ...state, userHotCollections: entityLoadingStarted(state.userHotCollections, action.payload) };
    case getType(actions.getUserHotCollections.success):
      return { ...state, userHotCollections: entityLoadingSucceeded(state.userHotCollections, action.payload) };
    case getType(actions.getUserHotCollections.failure):
      return { ...state, userHotCollections: entityLoadingFailed(state.userHotCollections) };
    case getType(actions.getNewHotCollections.request):
      return { ...state, newHotCollections: entityLoadingStarted(state.newHotCollections, action.payload) };
    case getType(actions.getNewHotCollections.success):
      return { ...state, newHotCollections: entityLoadingSucceeded(state.newHotCollections, action.payload) };
    case getType(actions.getNewHotCollections.failure):
      return { ...state, newHotCollections: entityLoadingFailed(state.newHotCollections) };
      case getType(actions.getOneCollection.request):
      return { ...state, oneCollection: entityLoadingStarted(state.oneCollection, action.payload) };
    case getType(actions.getOneCollection.success):
      return { ...state, oneCollection: entityLoadingSucceeded(state.oneCollection, action.payload) };
    case getType(actions.getOneCollection.failure):
      return { ...state, oneCollection: entityLoadingFailed(state.oneCollection) };
      
    case getType(actions.clearHotCollections):
      return { ...state, hotCollections: initEntityState(null) };
      
    default:
      return state;
  }
};

export default states;
