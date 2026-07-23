import { useQuery } from '@tanstack/react-query'

import { getMenu } from '../../services/menu'

export function useMenu() {
  return useQuery({ queryKey: ['menu'], queryFn: getMenu })
}
