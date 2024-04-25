import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  setGenres,
  setLists,
  setSelectedGenre,
} from "../lib/features/explore/exploreSlice";
import { getTopGenres, getListsByGenre } from "../lib/api";
import { Logger } from "../logger";
import { set } from "lodash";

const useExplore = () => {
  const dispatch = useAppDispatch();
  const { lists, genres, selectedGenre } = useAppSelector(
    (state) => state.explore
  );
  const [lastPageReached, setLastPageReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(false);
  const [loadingNewPage, setLoadingNewPage] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, _] = useState(10);

  useEffect(() => {
    if (!genres.length) {
      fetchTopGenres();
    }
  }, []);

  useEffect(() => {
    if (page === 1) {
      fetchLists(selectedGenre, page);
    } else {
      setPage(1);
    }
  }, [selectedGenre]);

  useEffect(() => {
    fetchLists(selectedGenre, page);
  }, [page]);

  const fetchTopGenres = async () => {
    try {
      if (loadingGenres) {
        return;
      }
      setLoadingGenres(true);
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
      setLoadingGenres(false);
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
      setLoadingNewPage(true);
    } else {
      if (loading) {
        return;
      }
      setLoading(true);
    }
    try {
      const response = await getListsByGenre({
        page,
        limit,
        genre,
      });
      if (response.length === 0) {
        setLastPageReached(true);
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
      setLoading(false);
      setLoadingNewPage(false);
    }
  };

  const selectGenre = (genre: string) => {
    dispatch(setSelectedGenre(genre));
  };

  const nextPage = () => {
    debugger;
    if (loadingNewPage) {
      return;
    }
    setPage(page + 1);
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
