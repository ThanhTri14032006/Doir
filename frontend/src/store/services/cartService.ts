import { api } from '../api';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart']
    }),
    addToCart: builder.mutation({
      query: (item) => ({
        url: '/cart/items',
        method: 'POST',
        body: item
      }),
      invalidatesTags: ['Cart']
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: 'PUT',
        body: { quantity }
      }),
      invalidatesTags: ['Cart']
    }),
    removeFromCart: builder.mutation({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/cart',
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    })
  })
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation
} = cartApi;