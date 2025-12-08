// src/services/literature.js
import api from "./apiConfig";

// Get all literature (accessible to guests)
export const getAllLiterature = async () => {
  try {
    const resp = await api.get("/literatures/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Get single literature item (accessible to guests)
export const getOneLiterature = async (id) => {
  try {
    const resp = await api.get(`/literatures/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Create new literature (authenticated only)
export const createLiterature = async (literatureData) => {
  try {
    const resp = await api.post("/literatures/", literatureData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Update literature (owner only)
export const updateLiterature = async (id, literatureData) => {
  try {
    const resp = await api.put(`/literatures/${id}/`, literatureData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Delete literature (owner only)
export const deleteLiterature = async (id) => {
  try {
    const resp = await api.delete(`/literatures/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Get all libraries for the logged-in user
export const getAllLibraries = async () => {
  try {
    const resp = await api.get("/libraries/");
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Get single library
export const getOneLibrary = async (id) => {
  try {
    const resp = await api.get(`/libraries/${id}/`);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Create new library
export const createLibrary = async (libraryData) => {
  try {
    const resp = await api.post("/libraries/", libraryData);
    return resp.data;
  } catch (error) {
    throw error;
  }
};

// Update library
export const updateLibrary = async (id, libraryData) => {
  try {
    const resp = await api.put(`/libraries/${id}/`, libraryData);
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

// Add literature to library
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