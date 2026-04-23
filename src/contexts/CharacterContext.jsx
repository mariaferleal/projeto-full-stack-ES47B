/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'

const API_URL = 'https://rickandmortyapi.com/api/character'

const CharacterContext = createContext(null)

const initialState = {
  characters: [],
  info: null,
  currentPage: 1,
  loading: false,
  error: '',
  filters: {
    name: '',
    status: '',
    species: '',
  },
  hasSearched: false,
}

function characterReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: '',
      }
    case 'SET_SUCCESS':
      return {
        ...state,
        loading: false,
        error: '',
        characters: action.payload.results,
        info: action.payload.info,
        currentPage: action.payload.page,
        hasSearched: true,
      }
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        characters: [],
        info: null,
        hasSearched: true,
      }
    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      }
    default:
      return state
  }
}

function buildQuery(filters, page) {
  const params = new URLSearchParams()
  params.set('page', String(page))

  if (filters.name) {
    params.set('name', filters.name.trim())
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.species) {
    params.set('species', filters.species.trim())
  }

  return params.toString()
}

export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(characterReducer, initialState)

  async function fetchCharacters(filters, page) {
    dispatch({ type: 'SET_LOADING' })

    try {
      const query = buildQuery(filters, page)
      const response = await fetch(`${API_URL}?${query}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Nenhum personagem encontrado para a busca informada.')
        }
        throw new Error('Falha ao consultar a API. Tente novamente em instantes.')
      }

      const data = await response.json()

      dispatch({
        type: 'SET_SUCCESS',
        payload: {
          results: data.results,
          info: data.info,
          page,
        },
      })
    } catch (requestError) {
      dispatch({
        type: 'SET_ERROR',
        payload: requestError.message,
      })
    }
  }

  function searchCharacters(filters) {
    dispatch({ type: 'SET_FILTERS', payload: filters })
    fetchCharacters(filters, 1)
  }

  function goToPage(page) {
    fetchCharacters(state.filters, page)
  }

  const value = {
    ...state,
    searchCharacters,
    goToPage,
  }

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>
}

export function useCharacters() {
  const context = useContext(CharacterContext)

  if (!context) {
    throw new Error('useCharacters deve ser utilizado dentro de CharacterProvider.')
  }

  return context
}
