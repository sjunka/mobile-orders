import { http, HttpResponse } from 'msw'

import { API_URL } from '../api/client'
import { menu } from './menu-data'

export const handlers = [http.get(`${API_URL}/menu`, () => HttpResponse.json(menu))]
