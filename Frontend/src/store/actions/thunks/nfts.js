import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchNftsBreakdown = (authorId) => async (dispatch, getState) => {
  
  //access the state
  const state = getState();
  console.log(state);

  dispatch(actions.getNftBreakdown.request(Canceler.cancel));

  try {
    let filter = authorId ? 'author='+authorId : '';
    const { data } = await Axios.get(`${api.baseUrl}${api.nfts}?${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getNftBreakdown.success(data));
  } catch (err) {
    dispatch(actions.getNftBreakdown.failure(err));
  }
};

export const fetchNftShowcase = () => async (dispatch) => {

  dispatch(actions.getNftShowcase.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.nftShowcases}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getNftShowcase.success(data));
  } catch (err) {
    dispatch(actions.getNftShowcase.failure(err));
  }
};

export const fetchNftDetail = (nftId) => async (dispatch) => {

  dispatch(actions.getNftDetail.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl + api.nfts}/get_detail`, {
      id: nftId
    }, {
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.code === 0)
      dispatch(actions.getNftDetail.success(data.data));
  } catch (err) {
    dispatch(actions.getNftDetail.failure(err));
  }
};

export const fetchNewNftList = () => async (dispatch) => {

  dispatch(actions.getNewNftList.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl + api.nfts}/get_new_items_list`, {
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.success) {
      dispatch(actions.getNewNftList.success(data.data));
    }
  } catch (err) {
    dispatch(actions.getNewNftList.failure(err));
  }
};

export const fetchNftList = (collectionId) => async (dispatch) => {

  dispatch(actions.getNftList.request(Canceler.cancel));

  try {
    
    const { data } = await Axios.post(`${api.baseUrl + api.nfts}/get_items_of_collection`, {
      colId: collectionId,
      start: 0,
      last: 10
    },{
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.success) {
      dispatch(actions.getNftList.success(data.data));
    }
  } catch (err) {
    dispatch(actions.getNftList.failure(err));
  }
};