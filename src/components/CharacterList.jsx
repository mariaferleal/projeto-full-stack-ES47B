import CharacterCard from './CharacterCard'

function CharacterList({ characters }) {
  return (
    <section className="card">
      <h2>Resultados</h2>
      <p className="result-count">Total exibido na pagina: {characters.length}</p>

      <div className="character-grid">
        {characters.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </section>
  )
}

export default CharacterList
