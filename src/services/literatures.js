// src/services/literature.js
import api from "./apiConfig";

export const getAllLiterature = async () => {
  try {
    const resp = await api.get("/literatures/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const getOneLiterature = async (id) => {
  try {
    const resp = await api.get(`/literatures/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const createLiterature = async (literatureData) => {
  try {
    const resp = await api.post("/literatures/", literatureData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const updateLiterature = async (id, literatureData) => {
  try {
    const resp = await api.put(`/literatures/${id}/`, literatureData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const deleteLiterature = async (id) => {
  try {
    const resp = await api.delete(`/literatures/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Library-related functions
export const getAllLibraries = async () => {
  try {
    const resp = await api.get("/libraries/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addLibraryToLiterature = async (literatureId, libraryId) => {
  try {
    // You'll need to implement this endpoint in Django
    const resp = await api.post(`/literatures/${literatureId}/add-library/${libraryId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

export const addToLibrary = async (literatureId, libraryId) => {
  try {
    const resp = await api.post(`/literatures/${literatureId}/add-library/${libraryId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Remove literature from library
export const removeFromLibrary = async (literatureId, libraryId) => {
  try {
    const resp = await api.post(`/literatures/${literatureId}/remove-library/${libraryId}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Create library
export const createLibrary = async (libraryData) => {
  try {
    const resp = await api.post("/libraries/", libraryData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Delete library
export const deleteLibrary = async (id) => {
  try {
    const resp = await api.delete(`/libraries/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};