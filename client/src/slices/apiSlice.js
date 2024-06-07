import {createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../constants';

const baseQuery = fetchBaseQuery({baseUrl:BASE_URL});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Product','Order','User'],
    endpoints: (builder) => ({}),
    keepUnusedDataFor: 5, // Optional: Set default keepUnusedDataFor value for all queries
    refetchOnMountOrArgChange: true, // Optional: Automatically refetch data on mount or arg change
});
