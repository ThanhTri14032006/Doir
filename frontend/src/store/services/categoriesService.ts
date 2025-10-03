import { api } from '../api';

export const categoriesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => '/categories',
      providesTags: ['Categories']
    })
  })
});

export const { useGetCategoriesQuery } = categoriesApi;