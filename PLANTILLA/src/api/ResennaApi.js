import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import axiosInstance from './axios';
import toast from 'react-hot-toast';

export const deleteResenna = (id) => {
  const response = axiosInstance.delete(`/resennas/${id}/`);
  return response;
};

export const useDeleteResennas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteResenna(id),
    onMutate: async (id) => {
      queryClient.cancelQueries(['resenna']);

      const previewItem = queryClient.getQueryData(['resenna']);

      queryClient.setQueryData(['resenna'], (old = []) =>
        old ? old.filter((item) => item.id != id) : []
      );

      return previewItem;
    },
    onSuccess: () => toast.success('Reseña elimanda con exitos '),

    onSettled: () => queryClient.invalidateQueries(['resenna']),
  });
};

export const GetAllResennas = () => {
  return useQuery({
    queryKey: ['resenna'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/resennas/');
      return data;
    },
  });
};
