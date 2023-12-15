import {FC} from 'react';
import {getFilmRating} from '../../utils/get-film-raiting.ts';

export type TabOverviewProps = {
  description: string;
  rating: number;
  scoresCount: number;
  director: string;
  starring: string[];
}

export const TabOverview: FC<TabOverviewProps> = ({description, rating, scoresCount, director, starring}) => (
  <>
    <div className="film-rating">
      <div className="film-rating__score">{rating}</div>
      <p className="film-rating__meta">
        <span className="film-rating__level">{getFilmRating(rating)}</span>
        <span className="film-rating__count">{scoresCount}</span>
      </p>
    </div>

    <div className="film-card__text">
      <p>{description}</p>

      <p className="film-card__director"><strong>Director: {director}</strong></p>

      <p className="film-card__starring"><strong>Starring: {starring.join(', ')}</strong></p>
    </div>
  </>
);
