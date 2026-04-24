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
          By Maria Fernanda Leal Pinheiro
        </p>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <SearchForm />
        </aside>
        <section className="results-section">
          {loading && <Loading />}
          {!loading && error && <ErrorMessage message={error} />}

          {!loading && !error && hasSearched && (
            <>
              <CharacterList characters={characters} />
              <Pagination
                info={info}
                currentPage={currentPage}
                onPageChange={goToPage}
                loading={loading}
              />
            </>
          )}

          {!loading && !hasSearched && (
            <section className="card card--results-box">
              <h2 className="panel-title">Resultados</h2>
              <p className="empty-state empty-state--in-card">
                Preencha os campos ao lado e clique em buscar para consultar a API.
              </p>
            </section>
          )}
        </section>
      </div>

      <footer className="app-footer">
        <div className="footer-slime-wave" aria-hidden="true">
          <img
            className="footer-slime-wave__img"
            src={`${import.meta.env.BASE_URL}footer-slime-wave.svg`}
            alt=""
            width={1200}
            height={64}
            decoding="async"
          />
        </div>
        <div className="footer-content">
          <p>
            Dados da{' '}
            <a
              href="https://rickandmortyapi.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Rick and Morty API
            </a>
            . Wubba lubba dub dub!
          </p>
        </div>
      </footer>
    </main>
  )
}

export default App