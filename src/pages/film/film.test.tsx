import { createMemoryHistory } from 'history';
import { AppRoute, AuthorizationStatus, NameSpace } from '../../const';
import { makeFakeFilm, makeFakeStore } from '../../utils/mocks';
import { render, screen } from '@testing-library/react';
import {withHistory, withStore} from '../../utils/mock-components.tsx';
import {Film} from './film.tsx';

describe('FilmScreen', () => {
  const mockFilm = makeFakeFilm();
  const mockHistory = createMemoryHistory();

  beforeEach(() => {
    mockHistory.push(`${AppRoute.FilmData}/${mockFilm.id}`);
  });

  it('render correctly', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Film />, mockHistory),
      makeFakeStore({
        [NameSpace.Film]: {
          films: [],
          isFilmsDataLoading: false,
          currentFilm: mockFilm,
          isFilmDataLoading: false,
          promoFilm: undefined,
          isPromoFilmLoading: false,
          currentSimilarFilms: [],
          isSimilarFilmsLoading: false
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByText(mockFilm.name)).toBeInTheDocument();
    expect(screen.getByText(mockFilm.genre)).toBeInTheDocument();
    expect(screen.getByText(mockFilm.released)).toBeInTheDocument();
    expect(screen.queryByText('Add review')).not.toBeInTheDocument();
  });

  it('shows add review button when user is authorized', () => {
    const { withStoreComponent } = withStore(
      withHistory(<Film />, mockHistory),
      makeFakeStore({
        [NameSpace.User]: {
          authorizationStatus: AuthorizationStatus.Auth,
          avatarUrl: '',
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByText('Add review')).toBeInTheDocument();
  });
});
