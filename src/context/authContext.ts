import { createContext } from 'react'

import type { AUTH_CONTEXT_TYPE } from '@/utils/types'

export const AuthContext = createContext<AUTH_CONTEXT_TYPE | null>(null)
