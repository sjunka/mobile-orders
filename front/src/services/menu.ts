import { apiGet } from '../api/client'
import type { Menu } from '../types/menu'

export function getMenu(): Promise<Menu> {
  return apiGet<Menu>('/menu')
}
