import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  authorList: initEntityState(null),
  authorRanking: initEntityState(null),
  authorDetail: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {

    case getType(actions.getAuthorList.request):
      return { ...state, authorList: entityLoadingStarted(state.authorList, action.payload) };
    case getType(actions.getAuthorList.success):
      return { ...state, authorList: entityLoadingSucceeded(state.authorList, action.payload) };
    case getType(actions.getAuthorList.failure):
      return { ...state, authorList: entityLoadingFailed(state.authorList) };

    case getType(actions.getAuthorRanking.request):
      return { ...state, authorRanking: entityLoadingStarted(state.authorRanking, action.payload) };
    case getType(actions.getAuthorRanking.success):
      return { ...state, authorRanking: entityLoadingSucceeded(state.authorRanking, action.payload) };
    case getType(actions.getAuthorRanking.failure):
      return { ...state, authorRanking: entityLoadingFailed(state.authorRanking) };

    case getType(actions.getAuthorDetail.request):
      return { ...state, authorDetail: entityLoadingStarted(state.authorDetail, action.payload) };
    case getType(actions.getAuthorDetail.success):
      return { ...state, authorDetail: entityLoadingSucceeded(state.authorDetail, action.payload) };
    case getType(actions.getAuthorDetail.failure):
      return { ...state, authorDetail: entityLoadingFailed(state.authorDetail) };

    default:
      return state;
  }
};

export default states;
