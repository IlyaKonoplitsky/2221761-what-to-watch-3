import {PreviewFilm} from '../../types/preview-film.ts';
import {DEFAULT_GENRE} from '../../const.ts';

export const getFilmsByGenre = (films: PreviewFilm[], genre: string) => {
  if (genre === DEFAULT_GENRE) {
    return films;
  }
  return films.filter((film) => film.genre === genre);
};
