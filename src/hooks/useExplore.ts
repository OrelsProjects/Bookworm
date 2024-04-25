import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  setGenres,
  setLists,
  setSelectedGenre,
  setLoading,
  setLoadingGenres,
  setLoadingNewPage,
  nextPage as nextPageAction,
  reset,
  setLastPageReached,
} from "../lib/features/explore/exploreSlice";
import { getTopGenres, getListsByGenre } from "../lib/api";
import { Logger } from "../logger";

const useExplore = () => {
  const dispatch = useAppDispatch();
  const {
    lists,
    genres,
    selectedGenre,
    loading,
    loadingGenres,
    loadingNewPage,
    page,
    lastPageReached,
  } = useAppSelector((state) => state.explore);
  const lastFetchTimestamp = useRef<number>(0);

  const [limit, _] = useState(10);

  useEffect(() => {
    if (!genres.length) {
      fetchTopGenres();
    }
  }, []);

  useEffect(() => {
    dispatch(reset());
    fetchLists(selectedGenre, 1);
  }, [selectedGenre]);

  useEffect(() => {
    fetchLists(selectedGenre, page);
  }, [page]);

  const fetchTopGenres = async () => {
    try {
      if (loadingGenres) {
        return;
      }
      dispatch(setLoadingGenres(true));
      const topGenres = await getTopGenres();
      if (topGenres.length === 0) {
        throw new Error("No genres found");
      }
      dispatch(setGenres(topGenres));
      dispatch(setSelectedGenre(topGenres[0]));
    } catch (error: any) {
      Logger.error("Error getting top genres", { error });
      throw error;
    } finally {
      dispatch(setLoadingGenres(false));
    }
  };

  const fetchLists = async (genre?: string, page: number = 1) => {
    if (lastPageReached) {
      return;
    }
    if (!genre) {
      return;
    }
    if (page > 1) {
      if (loadingNewPage) {
        return;
      }
      dispatch(setLoadingNewPage(true));
    } else {
      if (loading) {
        return;
      }
      dispatch(setLoading(true));
    }
    try {
      const now = Date.now();
      lastFetchTimestamp.current = now;
      const response = await getListsByGenre({
        page,
        limit,
        genre,
      });
      if (lastFetchTimestamp.current != now) {
        return;
      }
      if (response.length === 0) {
        dispatch(setLastPageReached(true));
        return;
      }
      let newList = [...response];
      if (page > 1) {
        newList = [...lists, ...response];
      }
      dispatch(setLists(newList));
    } catch (error: any) {
      Logger.error("Error getting lists by genre", { error });
    } finally {
      dispatch(setLoading(false));
      dispatch(setLoadingNewPage(false));
    }
  };

  const selectGenre = (genre: string) => {
    dispatch(setSelectedGenre(genre));
  };

  const nextPage = () => {
    if (loading || loadingNewPage || lastPageReached) {
      return;
    }
    dispatch(nextPageAction());
  };

  return {
    loading,
    loadingGenres,
    loadingNewPage,
    lists,
    genres,
    selectedGenre,
    selectGenre,
    nextPage,
  };
};

export default useExplore;
