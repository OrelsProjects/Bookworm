import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../lib/store";
import { Logger } from "../logger";
import {
  setRecommendationsLoading,
  setRecommendations,
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

const setRecommendationsInLocalStorage = (recommendations: SafeBooksListData[]) => {
  localStorage.setItem(
    RECOMMENDATIONS_DATA_KEY,
    JSON.stringify(recommendations)
  );
};

const useUserRecommendations = () => {
  const loading = useRef(false);
  const dispatch = useDispatch();
  const recommendations = useSelector(
    (state: RootState) => state.recommendations.recommendationsData
  );

  useEffect(() => {
    const storedRecommendations = getRecommendationsFromLocalStorage();
    if (storedRecommendations) {
      dispatch(setRecommendations(storedRecommendations));
    }
  }, [dispatch]);

  const loadUserRecommendations = async (user?: User | null) => {
    if (loading.current) {
      throw new Error(
        "Operation in progress. Please wait until the current operation completes."
      );
    }

    dispatch(setRecommendationsLoading(true));
    loading.current = true;

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
      loading.current = false;
      dispatch(setRecommendationsLoading(false));
    }
  };

  return {
    recommendations,
    loading: loading.current,
    loadUserRecommendations,
  };
};

export default useUserRecommendations;
