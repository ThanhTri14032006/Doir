import { api } from '../api';

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createContact: builder.mutation<{ id: number }, { name: string; email: string; message: string }>(
      {
        query: (body) => ({
          url: '/contacts',
          method: 'POST',
          body
        })
      }
    )
  })
});

export const { useCreateContactMutation } = contactApi;

