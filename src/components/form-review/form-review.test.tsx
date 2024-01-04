import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { redirectToRoute } from '../../store/action';
import { makeFakeFilmId } from '../../utils/mocks';
import { APIRoute, NameSpace } from '../../const';
import { extractActionsTypes } from '../../utils/mocks';
import {FormReview} from './form-review.tsx';
import {withStore} from '../../utils/mock-components.tsx';
import {postReview} from '../../store/post-review-process/api-action/api-action.ts';

describe('FormReview', () => {
  const mockFilmId = makeFakeFilmId();
  const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
    (<FormReview filmId={mockFilmId} />), {
      [NameSpace.PostingReview]: {
        isFormReviewSubmitting: false,
      }
    }
  );

  it('render correctly', () => {
    render(withStoreComponent);

    expect(screen.getAllByTestId('rating-star')).toHaveLength(10);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should check rating on click', async () => {
    render(withStoreComponent);
    await userEvent.click(screen.getAllByTestId('rating-star')[8]);

    expect(screen.getAllByTestId('rating-star')[8]).toBeChecked();
  });

  it('should type text in textarea', async () => {
    const expectedText = 'expected text';

    render(withStoreComponent);
    await userEvent.type(
      screen.getByPlaceholderText('Review text'),
      expectedText
    );

    expect(screen.getByDisplayValue(expectedText)).toBeInTheDocument();
  });

  it('should send review on submit click', async () => {
    render(withStoreComponent);
    mockAxiosAdapter.onPost(`${APIRoute.Comments}/${mockFilmId}`).reply(200);
    await userEvent.click(screen.getAllByTestId('rating-star')[8]);
    await userEvent.type(
      screen.getByPlaceholderText('Review text'),
      'review text with at least 50 symbols to pass length check'
    );
    await userEvent.click(screen.getByRole('button'));

    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([
      postReview.pending.type,
      redirectToRoute.type,
      postReview.fulfilled.type,
    ]);
  });
});
