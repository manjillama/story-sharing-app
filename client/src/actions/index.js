import { AUTH_USER, AUTH_ERROR } from './types';
import axios from 'axios';

export const signUp = (formProps, callback) => async dispatch => {
  try{
    const response = await axios.post('http://localhost:5000/signup', formProps);
    console.log(response);
    if(response.data.error)
      throw new Error('Email already taken');

    dispatch({type: AUTH_USER, payload: response.data});
    // Persisting login state, so that authentication is not lost when refreshing the page.
    localStorage.setItem('token', response.data.token);
    callback(false);
  }catch(e){
    dispatch({type: AUTH_ERROR, payload: null});
    callback(e.message);
  }
};


export const signIn = (formProps, callback) => async dispatch => {
  try{
    const response = await axios.post('http://localhost:5000/signin', formProps);
    if(response.data.error)
      throw new Error('Incorrent username or password');

    dispatch({type: AUTH_USER, payload: response.data});

    // Persisting login state, so that authentication is not lost when refreshing the page.
    localStorage.setItem('token', response.data.token);
    callback(false);
  }catch(e){
    dispatch({type: AUTH_ERROR, payload: null});
    callback(e.message);
  }
};

export const getUser = (token, callback) => async dispatch => {
  try{
    const headers = {'authorization': token};
    const response = await axios.get('http://localhost:5000/api/get-user', { headers })
    const payload = {token, user: response.data.user};
    dispatch({type: AUTH_USER, payload});
  }catch(e){
    if(e.message !== "Network Error")
      localStorage.removeItem('token');

    dispatch({type: AUTH_ERROR, payload: null});
  }finally{
    callback();
  }
};

export const signOut = (callback) => dispatch => {
  localStorage.removeItem('token');
  dispatch({type: AUTH_USER, payload:null});
  callback();
}
