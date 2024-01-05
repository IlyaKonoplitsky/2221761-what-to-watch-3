import { MemoryHistory, createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import { AppRoute, AuthorizationStatus, NameSpace } from '../../const';
import {App} from './app.tsx';
import {makeFakeFilmId, makeFakeStore, withHistory, withStore} from '../../utils';

describe('App', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    mockHistory = createMemoryHistory();
  });

  it('render "MainScreen" when user navigate to main page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    expect(screen.getByText(/All genres/i)).toBeInTheDocument();
  });

  it('render "FilmScreen" when user navigates to film page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());
    const mockFilmId = makeFakeFilmId();
    mockHistory.push(`${AppRoute.FilmData}/${mockFilmId}`);

    render(withStoreComponent);

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Details/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviews/i)).toBeInTheDocument();
  });

  it('render "PlayerScreen" when user navigates to player page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());
    const mockFilmId = makeFakeFilmId();
    mockHistory.push(`${AppRoute.Player}/${mockFilmId}`);

    render(withStoreComponent);

    expect(screen.getByText(/Exit/i)).toBeInTheDocument();
  });

  it('render "SingInScreen" when user navigates to sing in page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore());
    mockHistory.push(AppRoute.SignIn);

    render(withStoreComponent);

    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('render "MyListScreen" when user navigates to my list page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore({
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        avatarUrl: '',
      }
    }));
    mockHistory.push(AppRoute.MyList);

    render(withStoreComponent);

    expect(screen.getByText(/My List/i)).toBeInTheDocument();
    expect(screen.getByText(/Catalog/i)).toBeInTheDocument();
  });

  it('render "AddReviewScreen" when user navigates to add review page', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const mockFilmId = makeFakeFilmId();
    const { withStoreComponent } = withStore(withHistoryComponent, makeFakeStore({
      [NameSpace.User]: {
        authorizationStatus: AuthorizationStatus.Auth,
        avatarUrl: '',
      }
    }));
    mockHistory.push(`${AppRoute.FilmData}/${mockFilmId}/review`);

    render(withStoreComponent);

    expect(screen.getByText(/Add review/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Review text/i)).toBeInTheDocument();
    expect(screen.getByText(/Post/i)).toBeInTheDocument();
  });

  it('render "NotFoundScreen" when user navigates to non-existent route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      makeFakeStore()
    );
    mockHistory.push('/undefined');

    render(withStoreComponent);

    expect(screen.getByText('Похоже что такой страницы нет...')).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную страницу')).toBeInTheDocument();
  });
});


