"use client";

import { useEffect, useState } from "react";

export type IGetData<T> = (
  page: number,
  limit: number
) => Promise<IGetDataResponse<T>>;

export type IGetDataResponse<T> = {
  data: T[];
  hasNext: boolean;
  totalPage: number;
};

const useInfiniteScroll = <T>(getData: IGetData<T>, triggerValue: any) => {
  const [data, setData] = useState<T[]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  const getInitial = async () => {
    const response = await getData(1, limit);
    const { data, hasNext, totalPage } = response;
    setData(data);
    setHasNext(hasNext);
    setTotalPage(totalPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (triggerValue) {
      setData([]);
      getInitial();
    }
  }, [triggerValue]);

  const getMore = async (direction: "back" | "forward") => {
    if (hasNext) {
      const response = await getData(currentPage, limit);
      const { data, hasNext, totalPage } = response;
      switch (direction) {
        case "back":
          setData((oldData) => [...data, ...oldData]);
          break;
        case "forward":
          setData((oldData) => [...oldData, ...data]);
          break;
      }
      setHasNext(hasNext);
      setTotalPage(totalPage);
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    data,
    getMore,
    getInitial,
  };
};

export default useInfiniteScroll;
