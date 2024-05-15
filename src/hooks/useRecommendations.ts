import { useEffect, useState } from "react";
import axios from "axios";
import { Logger } from "../logger";
import {
  setRecommendationsLoading,
  setRecommendations,
  selectRecommendations,
} from "../lib/features/recommendations/recommendationsSlice";
import { User } from "../models";
import { IResponse } from "../models/dto/response";
import { SafeBooksListData } from "../models/booksList";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  RecommendationFilters,
  RecommentionFilterTypes,
} from "../models/recommendations";
import { selectAuth } from "../lib/features/auth/authSlice";

const RECOMMENDATIONS_DATA_KEY = "userRecommendationsData";

export type RecommendationSort = "Match" | "Rating" | "Views";

const getRecommendationsFromLocalStorage = (): SafeBooksListData[] => {
  return JSON.parse(
    localStorage.getItem(RECOMMENDATIONS_DATA_KEY) ?? "[]"
  ) as SafeBooksListData[];
};

const setRecommendationsInLocalStorage = (
  recommendations: SafeBooksListData[]
) => {
  localStorage.setItem(
    RECOMMENDATIONS_DATA_KEY,
    JSON.stringify(recommendations)
  );
};

const useRecommendations = () => {
  const dispatch = useAppDispatch();
  const { recommendationsData, loading } = useAppSelector(
    selectRecommendations
  );
  const { allDataFetched } = useAppSelector((state) => state.auth);

  const [sortedBy, setSortedBy] = useState<RecommendationSort>("Match");
  const [filteredWith, setFilters] = useState<RecommendationFilters>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredRecommendations, setFilteredRecommendations] = useState<
    SafeBooksListData[]
  >([]);

  useEffect(() => {
    const storedRecommendations = getRecommendationsFromLocalStorage();
    if (storedRecommendations) {
      dispatch(setRecommendations(storedRecommendations));
    }
  }, []);

  useEffect(() => {
    applyFiltersToLists(recommendationsData);
  }, [recommendationsData, sortedBy, filteredWith, searchValue]);

  const sort = (sorter: RecommendationSort) => {
    setSortedBy(sorter);
  };

  const filter = (filter: RecommentionFilterTypes, value: string) => {
    const filterCurrentValues = filteredWith?.[filter] || [];
    const newValues = filterCurrentValues.includes(value)
      ? filterCurrentValues.filter((v) => v !== value)
      : [...filterCurrentValues, value];
    setFilters({
      ...filteredWith,
      [filter]: newValues,
    });
  };

  const search = (value: string) => {
    setSearchValue(value);
  };

  const getFilteredLists = (lists: SafeBooksListData[]) => {
    let filteredLists = [...lists];
    if (!filteredWith) return filteredLists;
    Object.keys(filteredWith || {}).forEach((key) => {
      switch (key) {
        case "genres":
          const filterGenres = filteredWith.genres;
          if (!filterGenres || filterGenres.length === 0) return lists;
          filteredLists = lists.filter((list) =>
            list.genres?.some((genre) => filterGenres.includes(genre))
          );
          break;
        default:
          break;
      }
    });
    return filteredLists;
  };

  const getSortedLists = (lists: SafeBooksListData[]) => {
    let sortedLists = [...lists];
    switch (sortedBy) {
      case "Match":
        sortedLists = sortedLists.sort(
          (a, b) => (b.matchRate || 0) - (a.matchRate || 0)
        );
        break;
      case "Rating":
        sortedLists = [...sortedLists];
        break;
      case "Views":
        sortedLists.sort((a, b) => (b.visitCount || 0) - (a.visitCount || 0));
        break;
      default:
        break;
    }
    return sortedLists;
  };

  const getSearchedLists = (lists: SafeBooksListData[]) => {
    return lists.filter(
      (list) =>
        list.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        list.curatorName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        list.genres?.some((genre) => genre.toLowerCase().includes(searchValue))
    );
  };

  const applyFiltersToLists = (lists: SafeBooksListData[]) => {
    let filteredLists = getFilteredLists(lists);
    filteredLists = getSearchedLists(filteredLists);
    filteredLists = getSortedLists(filteredLists);
    setFilteredRecommendations(filteredLists);
  };

  const loadUserRecommendations = async (user?: User | null) => {
    if (loading) {
      throw new Error(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
    if (allDataFetched) return;
    dispatch(setRecommendationsLoading(true));

    try {
      if (user) {
        axios.defaults.headers.common["Authorization"] = user.token;
        axios.defaults.headers.common["user_id"] = user.userId;
      }

      const response = await axios.get<IResponse<SafeBooksListData[]>>(
        "/api/list/recommendations"
      );
      const recommendationsDataResponse = response.data.result ?? [];

      dispatch(setRecommendations(recommendationsDataResponse));
      setRecommendationsInLocalStorage(recommendationsDataResponse);
    } catch (error: any) {
      Logger.error("Failed to fetch user recommendations", error);
    } finally {
      dispatch(setRecommendationsLoading(false));
    }
  };

  return {
    sort,
    filter,
    search,
    loading,
    sortedBy,
    searchValue,
    filteredWith,
    loadUserRecommendations,
    filteredRecommendations,
    allRecommendations: recommendationsData,
  };
};

export default useRecommendations;
