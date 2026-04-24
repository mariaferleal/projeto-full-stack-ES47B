/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react'

const API_URL =
  window.location.hostname === 'localhost'
    ? '/api/character'
    : 'https://rickandmortyapi.com/api/character'
const PAGE_SIZE = 20

let characterCatalogPromise = null

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
    params.set('name', normalizeNameForApi(filters.name))
  }

  if (filters.status) {
    params.set('status', filters.status)
  }

  if (filters.species) {
    params.set('species', filters.species.trim())
  }

  return params.toString()
}

function normalizeNameForApi(name) {
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function normalizeText(value) {
  return value.trim().toLowerCase()
}

function filterCharacters(characters, filters) {
  const name = normalizeText(filters.name)
  const species = normalizeText(filters.species)

  return characters.filter((character) => {
    const matchesName = normalizeText(character.name).includes(name)
    const matchesStatus = !filters.status || character.status.toLowerCase() === filters.status
    const matchesSpecies = !species || normalizeText(character.species).includes(species)

    return matchesName && matchesStatus && matchesSpecies
  })
}

function paginateCharacters(characters, page) {
  const totalPages = Math.ceil(characters.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE

  return {
    info: {
      count: characters.length,
      pages: totalPages,
      next: page < totalPages ? String(page + 1) : null,
      prev: page > 1 ? String(page - 1) : null,
    },
    results: characters.slice(startIndex, startIndex + PAGE_SIZE),
  }
}

export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(characterReducer, initialState)

  async function fetchWithRetry(urls, options = {}, retries = 2) {
    let lastError = null
    const requestUrls = Array.isArray(urls) ? urls : [urls]

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const url = requestUrls[Math.min(attempt, requestUrls.length - 1)]
        const response = await fetch(url, options)

        if (response.status === 526 && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
          continue
        }

        return response
      } catch (networkError) {
        lastError = networkError
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)))
          continue
        }
      }
    }

    throw lastError ?? new Error('Falha de rede ao consultar a API.')
  }

  async function fetchCharacterCatalog() {
    if (!characterCatalogPromise) {
      characterCatalogPromise = (async () => {
        const firstResponse = await fetchWithRetry([`${API_URL}?page=1`, `${API_URL}/?page=1`])

        if (!firstResponse.ok) {
          throw new Error('Falha ao carregar catalogo de personagens.')
        }

        const firstPage = await firstResponse.json()
        const remainingPages = Array.from(
          { length: firstPage.info.pages - 1 },
          (_, index) => index + 2,
        )

        const remainingResults = await Promise.all(
          remainingPages.map(async (catalogPage) => {
            const response = await fetchWithRetry([
              `${API_URL}?page=${catalogPage}`,
              `${API_URL}/?page=${catalogPage}`,
            ])

            if (!response.ok) {
              throw new Error('Falha ao carregar catalogo de personagens.')
            }

            return response.json()
          }),
        )

        return [firstPage, ...remainingResults].flatMap((catalogPage) => catalogPage.results)
      })().catch((catalogError) => {
        characterCatalogPromise = null
        throw catalogError
      })
    }

    return characterCatalogPromise
  }

  async function fetchCharactersFromCatalog(filters, page) {
    const catalog = await fetchCharacterCatalog()
    const filteredCharacters = filterCharacters(catalog, filters)

    if (filteredCharacters.length === 0) {
      throw new Error('Nenhum personagem encontrado para a busca informada.')
    }

    return paginateCharacters(filteredCharacters, page)
  }

  async function fetchCharacters(filters, page) {
    dispatch({ type: 'SET_LOADING' })

    try {
      const query = buildQuery(filters, page)
      const response = await fetchWithRetry([
        `${API_URL}?${query}`,
        `${API_URL}/?${query}`,
      ])

      if (!response.ok) {
        if (response.status === 526) {
          const fallbackData = await fetchCharactersFromCatalog(filters, page)

          dispatch({
            type: 'SET_SUCCESS',
            payload: {
              results: fallbackData.results,
              info: fallbackData.info,
              page,
            },
          })
          return
        }
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
      try {
        const fallbackData = await fetchCharactersFromCatalog(filters, page)

        dispatch({
          type: 'SET_SUCCESS',
          payload: {
            results: fallbackData.results,
            info: fallbackData.info,
            page,
          },
        })
      } catch (fallbackError) {
        dispatch({
          type: 'SET_ERROR',
          payload: fallbackError.message || requestError.message,
        })
      }
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