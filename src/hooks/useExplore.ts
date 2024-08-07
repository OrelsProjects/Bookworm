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
import useSearch from "./useSearch";

const useExplore = () => {
  const dispatch = useAppDispatch();
  const {
    page,
    lists,
    genres,
    loading,
    selectedGenre,
    loadingGenres,
    loadingNewPage,
    lastPageReached,
  } = useAppSelector((state) => state.explore);

  const [limit, _] = useState(10);
  const selectedGenreRef = useRef(selectedGenre);

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

  const fetchLists = useCallback(
    async (genre?: string, page: number = 1) => {
      if (!genre) {
        return;
      }
      if (page > 1) {
        if (loadingNewPage) {
          return;
        }
        dispatch(setLoadingNewPage(true));
      } else if (genre === selectedGenreRef.current) {
        return;
      }
      selectedGenreRef.current = genre;
      dispatch(setLoading(true));

      if (lastPageReached) {
        return;
      }

      try {
        const response = await getListsByGenre({
          page,
          limit,
          genre,
        });
        if (genre !== selectedGenreRef.current) {
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
        if (genre === selectedGenreRef.current) {
          dispatch(setLoading(false));
          dispatch(setLoadingNewPage(false));
        }
      }
    },
    [selectedGenreRef, lists, loading, loadingNewPage, lastPageReached]
  );

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
