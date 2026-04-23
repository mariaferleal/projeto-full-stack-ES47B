import SearchForm from './components/SearchForm'
import CharacterList from './components/CharacterList'
import Pagination from './components/Pagination'
import Loading from './components/Loading'
import ErrorMessage from './components/ErrorMessage'
import { useCharacters } from './contexts/CharacterContext'

function App() {
  const { characters, info, currentPage, loading, error, hasSearched, goToPage } =
    useCharacters()

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Buscador Rick and Morty</h1>
        <p>
          By Maria Fernanda Leal Pinheiro.
        </p>
      </header>

      <SearchForm />

      {loading && <Loading />}
      {!loading && error && <ErrorMessage message={error} />}

      {!loading && !error && hasSearched && (
        <>
          <CharacterList characters={characters} />
          <Pagination info={info} currentPage={currentPage} onPageChange={goToPage} />
        </>
      )}

      {!loading && !hasSearched && (
        <p className="empty-state">
          Preencha os campos acima e clique em buscar para consultar a API.
        </p>
      )}
    </main>
  )
}

export default App