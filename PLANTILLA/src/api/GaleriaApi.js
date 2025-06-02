import { useQuery } from '@tanstack/react-query';
import axiosInstance from './axios';

export const GetAllPhoto = () => {
  return useQuery({
    queryKey: ['fotos'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/fotos/');
      return data;
    },
  });
};

export const createPhoto = async (data) => {
  const response = await axiosInstance.post('/fotos/', data);
  return response;
};

export const updatePhoto = async (id, data) => {
  const response = await axiosInstance.patch(`/fotos/${id}/`, data);
  return response;
};

export const deletePhoto = async (id) => {
  const response = await axiosInstance.delete(`/fotos/${id}/`);
  return response;
};
