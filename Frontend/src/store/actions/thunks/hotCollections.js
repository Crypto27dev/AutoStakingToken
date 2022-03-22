import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchHotCollections = (page, categoryId) => async (dispatch) => {
  dispatch(actions.getHotCollections.request(Canceler.cancel));
  try {
    const { data } = await Axios.post(`${api.baseUrl + api.collection}/get_category_collections`, {
      page: page,
      categoryId: categoryId,
      limit: 9
    });

    if (data.success) {
      dispatch(actions.getHotCollections.success(data.data));
    }
  } catch (err) {
    dispatch(actions.getHotCollections.failure(err));
  }
};

export const fetchUserCollections = (page, authorId, total = false) => async (dispatch) => {
  dispatch(actions.getUserHotCollections.request(Canceler.cancel));
  
  try {
    dispatch(actions.showLoader());
    const limit = total === true ? 0 : 9;
    const { data } = await Axios.post(`${api.baseUrl + api.collection}/getUserCollections`, 
    {
      page: page,
      userId: authorId,
      limit: limit
    }, 
    {
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.success) {
      dispatch(actions.getUserHotCollections.success(data.data));
    }

  } catch (err) {
    dispatch(actions.getUserHotCollections.failure(err));
  } finally {
    dispatch(actions.hideLoader());
  }
};

export const fetchNewCollections = () => async (dispatch) => {
  dispatch(actions.getNewHotCollections.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl + api.collection}/get_new_collection_list`, 
    {
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.success) {
      dispatch(actions.getNewHotCollections.success(data.data));
    }

  } catch (err) {
    dispatch(actions.getNewHotCollections.failure(err));
  }
};

export const fetchOneCollection = (collectionId) => async (dispatch) => {
  dispatch(actions.getOneCollection.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl + api.collection}/detail`, 
    { id: collectionId },
    {
      cancelToken: Canceler.token,
      params: {}
    });
    if (data.success) {
      dispatch(actions.getOneCollection.success(data.data));
    }

  } catch (err) {
    dispatch(actions.getOneCollection.failure(err));
  }
}

export const getHotCollections = async (page, categoryId) => {
  try {
    const { data } = await Axios.post(`${api.baseUrl + api.collection}/get_category_collections`, {
      page: page,
      categoryId: categoryId,
      limit: 9
    });
    return data;
  } catch (err) {
    return {
      success: false
    }
  }
};