// vamos a crear el crear , actualizar y eliminar

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, deleteUser, updateUser } from '../../api/UsuarioApi';
import toast from 'react-hot-toast';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      return createUser(data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousItems = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old = []) => [
        ...(old ?? []),
        { ...data },
      ]);

      return previousItems;
    },
    onSuccess: () => toast.success('Usuario agregado'),

    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),

    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousItems = queryClient.getQueriesData(['users']);

      queryClient.setQueryData(['users'], (old) =>
        old ? old.map((item) => (item.id === data.id ? data : item)) : []
      );

      return { previousItems };
    },
    onSuccess: () => toast.success('Usuario Actualizado'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousItems = queryClient.getQueriesData(['users']);

      queryClient.setQueryData(['users'], (old) =>
        old ? old.filter((item) => item.id !== id) : []
      );

      return { previousItems };
    },
    onSuccess: () => toast.success('Usuario eliminado'),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
