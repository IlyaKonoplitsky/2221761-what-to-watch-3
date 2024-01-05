import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoute, AuthorizationStatus, FILM_SAME_GENRE_COUNT } from '../../const';
import useFilmById from '../../hooks/use-film-by-id.ts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect } from 'react';
import {FilmList, Footer, Logo, Tabs, UserBlock, Spinner, ChangeFavoriteStatus} from '../../components';
import {
  fetchFilmReviewsAction, fetchSimilarFilmsAction,
  getAuthorizationStatus,
  getCurrentFilmReviews,
  getCurrentSimilarFilms,
  getFilmDataLoading,
  getFilmReviewsLoading,
  getSimilarFilmsLoading
} from '../../store';

export const Film = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const film = useFilmById();
  const isFilmDataLoading = useAppSelector(getFilmDataLoading);

  const similarFilms = useAppSelector(getCurrentSimilarFilms);
  const isSimilarFilmsDataLoading = useAppSelector(getSimilarFilmsLoading);

  const filmReviews = useAppSelector(getCurrentFilmReviews);
  const isFilmReviewsDataLoading = useAppSelector(getFilmReviewsLoading);

  const authorizationStatus = useAppSelector(getAuthorizationStatus);

  useEffect(() => {
    if (film) {
      dispatch(fetchFilmReviewsAction({filmId: film.id}));
      dispatch(fetchSimilarFilmsAction({filmId: film.id}));
    }
  }, [dispatch, film]);

  if (!film || isFilmDataLoading) {
    return <Spinner/>;
  }

  return (
    <div>
      <Helmet>
        <title>WTW. {film.name}</title>
      </Helmet>
      <section className="film-card film-card--full" style={{background: film.backgroundColor}}>
        <div className="film-card__hero">
          <div className="film-card__bg">
            <img src={film.backgroundImage} alt={film.name} />
          </div>

          <h1 className="visually-hidden">WTW</h1>

          <header className="page-header film-card__head">
            <Logo />
            <UserBlock />
          </header>

          <div className="film-card__wrap">
            <div className="film-card__desc">
              <h2 className="film-card__title">{film.name}</h2>
              <p className="film-card__meta">
                <span className="film-card__genre">{film.genre}</span>
                <span className="film-card__year">{film.released}</span>
              </p>

              <div className="film-card__buttons">
                <button className="btn btn--play film-card__button" type="button" onClick={() => navigate(`${AppRoute.Player}/${film.id}`)}>
                  <svg viewBox="0 0 19 19" width="19" height="19">
                    <use xlinkHref="#play-s"></use>
                  </svg>
                  <span>Play</span>
                </button>
                <ChangeFavoriteStatus
                  filmId={film.id}
                  authorizationStatus={authorizationStatus}
                />

                {authorizationStatus === AuthorizationStatus.Auth &&
                  <Link to={`${AppRoute.FilmData}/${film.id}/review`} className="btn film-card__button">Add review</Link>}
              </div>
            </div>
          </div>
        </div>

        <div className="film-card__wrap film-card__translate-top">
          <div className="film-card__info">
            <div className="film-card__poster film-card__poster--big">
              <img src={film.posterImage} alt={film.name} width="218" height="327" />
            </div>
            <Tabs film={film} reviews={isFilmReviewsDataLoading ? [] : filmReviews} />

          </div>
        </div>
      </section>

      <div className="page-content">
        {similarFilms?.length !== 0 && !isSimilarFilmsDataLoading &&
          <section className="catalog catalog--like-this">
            <h2 className="catalog__title">More like this</h2>
            <FilmList films={similarFilms} filmCount={FILM_SAME_GENRE_COUNT} />
          </section>}
        <Footer />
      </div>
    </div>
  );
};
