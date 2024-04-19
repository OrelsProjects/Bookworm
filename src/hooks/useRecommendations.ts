import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Logger } from "../logger";
import {
  setRecommendationsLoading,
  setRecommendations,
  selectRecommendations,
} from "../lib/features/recommendations/recommendationsSlice";
import { User } from "../models";
import { IResponse } from "../models/dto/response";
import { SafeBooksListData } from "../models/booksList";

const RECOMMENDATIONS_DATA_KEY = "userRecommendationsData";

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

const useUserRecommendations = () => {
  const dispatch = useDispatch();
  const { recommendationsData, loading } = useSelector(selectRecommendations);

  useEffect(() => {
    const storedRecommendations = getRecommendationsFromLocalStorage();
    if (storedRecommendations) {
      dispatch(setRecommendations(storedRecommendations));
    }
  }, [dispatch]);

  const loadUserRecommendations = async (user?: User | null) => {
    if (loading) {
      throw new Error(
        "Operation in progress. Please wait until the current operation completes."
      );
    }
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
    recommendations: recommendationsData,
    loading,
    loadUserRecommendations,
  };
};

export default useUserRecommendations;
