import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, State } from '../types/state';
import { AxiosInstance } from 'axios';
import { redirectToRoute } from './action';
import { APIRoute, AppRoute } from '../const';
import { PreviewFilm } from '../types/preview-film';
import { AuthData } from '../types/auth-data';
import { UserData } from '../types/user-data';
import { dropToken, saveToken } from '../services/token';
import { Film } from '../types/film';
import { Review } from '../types/review';
import { ReviewAddingData } from '../types/review-adding-data';
import { PromoFilm } from '../types/promo-film';
import { FilmFavoriteStatus } from '../types/film-favorite-status';
import { FavoriteFilmPostData } from '../types/favorite-film-post-data';

export const fetchFilmAction = createAsyncThunk<Film, {filmId: string}, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchFilm',
  async ({filmId}, {extra: api}) => {
    const {data} = await api.get<Film>(`${APIRoute.Films}/${filmId}`);
    return data;
  },
);

export const fetchPromoFilmAction = createAsyncThunk<PromoFilm, undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchPromoFilm',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<PromoFilm>(`${APIRoute.PromoFilm}`);
    return data;
  },
);

export const fetchSimilarFilmsAction = createAsyncThunk<PreviewFilm[], {filmId: string}, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchSimilarFilms',
  async ({filmId}, {extra: api}) => {
    const {data} = await api.get<PreviewFilm[]>(`${APIRoute.Films}/${filmId}/similar`);
    return data;
  },
);

export const fetchFilmReviewsAction = createAsyncThunk<Review[], {filmId: string}, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'data/fetchFilmReviews',
  async ({filmId}, {extra: api}) => {
    const {data} = await api.get<Review[]>(`${APIRoute.Comments}/${filmId}`);
    return data;
  },
);

export const fetchFilmsAction = createAsyncThunk<PreviewFilm[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFilms',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<PreviewFilm[]>(APIRoute.Films);
    return data;
  },
);

export const fetchFavoriteFilmsAction = createAsyncThunk<PreviewFilm[], undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'data/fetchFavoriteFilms',
  async (_arg, {extra: api}) => {
    const {data} = await api.get<PreviewFilm[]>(APIRoute.FavoriteFilms);
    return data;
  },
);

export const postFilmFavoriteStatus = createAsyncThunk<
  FavoriteFilmPostData,
  FilmFavoriteStatus,
  { dispatch: AppDispatch; extra: AxiosInstance }
>('myList/setFilmFavoriteStatus', async ({ id, status }, { extra: api }) => {
  const { data } = await api.post<FavoriteFilmPostData>(
    `${APIRoute.FavoriteFilms}/${id}/${status}`
  );
  return data;
});

export const checkAuthAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
}>(
  'user/checkAuth',
  async (_arg, {extra: api}) => {
    await api.get(APIRoute.Login);
  },
);

export const loginAction = createAsyncThunk<void, AuthData, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'user/login',
  async ({login: email, password}, {dispatch, extra: api}) => {
    const {data: {token}} = await api.post<UserData>(APIRoute.Login, {email, password});
    saveToken(token);
    dispatch(redirectToRoute(AppRoute.Main));
  },
);

export const logoutAction = createAsyncThunk<void, undefined, {
  dispatch: AppDispatch;
  extra: AxiosInstance;
}>(
  'user/logout',
  async (_arg, {extra: api}) => {
    await api.delete(APIRoute.Logout);
    dropToken();
  },
);

export const postReview = createAsyncThunk<
  void,
  ReviewAddingData,
  { dispatch: AppDispatch; extra: AxiosInstance }
>('review/post', async ({ id: filmId, comment, rating }, { extra: api }) => {
  await api.post<ReviewAddingData>(`${APIRoute.Comments}/${filmId}`, { comment, rating });
});

