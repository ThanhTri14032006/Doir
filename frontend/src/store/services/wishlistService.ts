import { api } from '../api';

export const wishlistService = api.injectEndpoints({
  endpoints: (build) => ({
    getWishlist: build.query<any[], void>({
      query: () => ({ url: '/wishlist' }),
      providesTags: ['Products']
    }),
    addToWishlist: build.mutation<{ message: string }, { product_id: number }>({
      query: (body) => ({ url: '/wishlist/items', method: 'POST', body }),
      invalidatesTags: ['Products']
    }),
    removeFromWishlist: build.mutation<{ message: string }, { productId: number }>({
      query: ({ productId }) => ({ url: `/wishlist/items/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Products']
    }),
    clearWishlist: build.mutation<{ message: string }, void>({
      query: () => ({ url: '/wishlist', method: 'DELETE' }),
      invalidatesTags: ['Products']
    })
  })
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation
} = wishlistService;



