import { api } from '../api';

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params
      }),
      providesTags: ['Products']
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ['Products']
    }),
    getFeaturedProducts: builder.query({
      query: () => '/products/featured',
      providesTags: ['Products']
    }),
    getNewArrivals: builder.query({
      query: () => '/products/new-arrivals',
      providesTags: ['Products']
    })
  })
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetFeaturedProductsQuery,
  useGetNewArrivalsQuery
} = productsApi;