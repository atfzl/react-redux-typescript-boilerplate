import { Action } from 'redux-actions';
import { combineEpics, Epic } from 'redux-observable';

import { isActionOf } from 'typesafe-actions';

import { IRootState, IRootAction } from '@reducers';
import { IMovieListType, movieList } from '@services/moviedb';

import actions from './actions';

const getMoreMovieListEpic: Epic<IRootAction, IRootState> = (action$, store) =>
  action$
    .filter(isActionOf(actions.epicGetOnScrollMovieList))
    .mergeMap((action: Action<IMovieListType>) => {
      const type = action.payload as IMovieListType;

      const movieListData = store.getState().movies[type];

      const page = (movieListData && movieListData.page) || 0;

      const oldResults = (movieListData && movieListData.results) || [];

      return movieList(type, page + 1).map(result =>
        actions.updateMovieList({
          type,
          data: { ...result, results: [...oldResults, ...result.results] }
        })
      );
    });

export default combineEpics(getMoreMovieListEpic);