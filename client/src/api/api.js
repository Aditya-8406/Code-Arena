const API_BASE = '/api';

/**
 * Core fetch wrapper with auth header injection and centralized error handling
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('codearena_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response',
  }));

  if (!response.ok) {
    // If unauthorized, clear stale token
    if (response.status === 401 && token) {
      localStorage.removeItem('codearena_token');
      localStorage.removeItem('codearena_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Authentication
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => apiRequest('/auth/me', { method: 'GET' }),

  // Problems
  getProblems: (params = {}) => {
    const query = new URLSearchParams();
    if (params.topic) query.append('topic', params.topic);
    if (params.difficulty) query.append('difficulty', params.difficulty);
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    return apiRequest(`/problems?${query.toString()}`);
  },
  getProblem: (idOrSlug) => apiRequest(`/problems/${idOrSlug}`),
  createProblem: (problemData) => apiRequest('/problems', { method: 'POST', body: JSON.stringify(problemData) }),
  updateProblem: (id, problemData) => apiRequest(`/problems/${id}`, { method: 'PUT', body: JSON.stringify(problemData) }),
  deleteProblem: (id) => apiRequest(`/problems/${id}`, { method: 'DELETE' }),

  // Code Execution & Submissions
  runCode: (payload) => apiRequest('/submissions/run', { method: 'POST', body: JSON.stringify(payload) }),
  submitCode: (payload) => apiRequest('/submissions/submit', { method: 'POST', body: JSON.stringify(payload) }),
  getMySubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/submissions/my${query ? `?${query}` : ''}`);
  },
  getProblemSubmissions: (problemId) => apiRequest(`/submissions/problem/${problemId}`),
  getAllSubmissions: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/submissions/admin/all${query ? `?${query}` : ''}`);
  },

  // Assessments
  getAssessments: () => apiRequest('/assessments'),
  getAssessmentById: (id) => apiRequest(`/assessments/${id}`),
  startAssessment: (id) => apiRequest(`/assessments/${id}/start`, { method: 'POST' }),
  submitAssessment: (id) => apiRequest(`/assessments/${id}/submit`, { method: 'POST' }),
  getAssessmentResults: (id) => apiRequest(`/assessments/${id}/results`),
  createAssessment: (assessmentData) => apiRequest('/assessments', { method: 'POST', body: JSON.stringify(assessmentData) }),
  updateAssessment: (id, data) => apiRequest(`/assessments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAssessment: (id) => apiRequest(`/assessments/${id}`, { method: 'DELETE' }),

  // Dashboards
  getStudentDashboard: () => apiRequest('/dashboard/student'),
  getTeacherDashboard: () => apiRequest('/dashboard/teacher'),
  getStudentDetail: (id) => apiRequest(`/dashboard/student/${id}`),

  // Leaderboard
  getLeaderboard: () => apiRequest('/leaderboard'),

  // Recommendations
  getRecommendations: () => apiRequest('/recommendations'),
};

export default api;
