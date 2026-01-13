import apiClient from './client';

export interface PersonalizationResponse {
    id: string;
    userId: string;
    bookId?: string;
    bookTitle?: string;
    bookSlug?: string;
    childFirstName: string;
    childAge: number;
    childPhotoUrl: string;
    languageCode: string;
    gender?: 'male' | 'female' | 'other';
    status: string;
    previewData?: Record<string, any>;
    generatedBookUrl?: string;
    faceDetectionData?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePersonalizationRequest {
    bookId?: string;
    childFirstName: string;
    childAge: number;
    childPhotoUrl: string;
    languageCode?: string;
    gender?: 'male' | 'female' | 'other';
}

export interface UpdatePersonalizationRequest {
    childFirstName?: string;
    childAge?: number;
    childPhotoUrl?: string;
    languageCode?: string;
    gender?: 'male' | 'female' | 'other';
}

/**
 * Create a new personalization
 */
export async function createPersonalization(
    request: CreatePersonalizationRequest
): Promise<PersonalizationResponse> {
    const response = await apiClient.post<PersonalizationResponse>('/personalizations', request);
    return response.data;
}

/**
 * Get personalization by ID
 */
export async function getPersonalization(id: string): Promise<PersonalizationResponse> {
    const response = await apiClient.get<PersonalizationResponse>(`/personalizations/${id}`);
    return response.data;
}

/**
 * Update personalization
 */
export async function updatePersonalization(
    id: string,
    request: UpdatePersonalizationRequest
): Promise<PersonalizationResponse> {
    const response = await apiClient.put<PersonalizationResponse>(`/personalizations/${id}`, request);
    return response.data;
}

/**
 * Upload photo for personalization
 */
export async function uploadPersonalizationPhoto(
    id: string,
    file: File
): Promise<{ message: string; photoUrl: string; personalization: PersonalizationResponse }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{
        message: string;
        photoUrl: string;
        personalization: PersonalizationResponse;
    }>(`/personalizations/${id}/upload-photo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}

/**
 * Approve personalization
 */
export async function approvePersonalization(
    id: string
): Promise<{ message: string; personalization: PersonalizationResponse }> {
    const response = await apiClient.post<{
        message: string;
        personalization: PersonalizationResponse;
    }>(`/personalizations/${id}/approve`);
    return response.data;
}

/**
 * Get all personalizations for the current user
 */
export async function getUserPersonalizations(
    status?: string
): Promise<PersonalizationResponse[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<PersonalizationResponse[]>('/personalizations', { params });
    return response.data;
}




