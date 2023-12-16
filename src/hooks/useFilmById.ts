import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFilmAction } from '../store/api-actions';
import {useTypedDispatch, useTypedSelector} from './redux.ts';

export default function useFilmById() {
  const {id} = useParams();
  const dispatch = useTypedDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchFilmAction({filmId: id}));
    }
  }, [dispatch, id]);

  return useTypedSelector((state) => state.currentFilm);
}