import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchAuthorList = (authorId) => async (dispatch) => {

  dispatch(actions.getAuthorList.request(Canceler.cancel));

  try {
    let filter = authorId ? 'id='+authorId : '';
    const { data } = await Axios.get(`${api.baseUrl}${api.authors}?${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getAuthorList.success(data));
  } catch (err) {
    dispatch(actions.getAuthorList.failure(err));
  }
};

export const fetchAuthorRanking = (_time, _category) => async (dispatch) => {

  dispatch(actions.getAuthorRanking.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl}${api.collectionRank}`, {time: _time, category: _category});

    dispatch(actions.getAuthorRanking.success(data));
  } catch (err) {
    dispatch(actions.getAuthorRanking.failure(err));
  }
};

export const fetchAuthorDetail = (authorId) => async (dispatch) => {
  dispatch(actions.getAuthorDetail.request(Canceler.cancel));

  try {
    const { data } = await Axios.post(`${api.baseUrl + api.user}/findOne`, {
      userId: authorId
    }, {
      cancelToken: Canceler.token,
      params: {}
    });

    if (data.success) {
      dispatch(actions.getAuthorDetail.success(data.data));
    }
  } catch (err) {
    dispatch(actions.getAuthorDetail.failure(err));
  }
}
