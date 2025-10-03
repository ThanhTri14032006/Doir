import { api } from '../api';

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUserOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Orders']
    }),
    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders']
    }),
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData
      }),
      invalidatesTags: ['Orders', 'Cart']
    })
  })
});

export const {
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation
} = ordersApi;