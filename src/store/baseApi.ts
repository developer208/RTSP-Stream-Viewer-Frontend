import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from '@/utils/constants'

// Single API slice; feature endpoints are added with `baseApi.injectEndpoints`.
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  tagTypes: [],
  endpoints: () => ({}),
})
