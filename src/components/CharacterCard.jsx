function CharacterCard({ character }) {
  return (
    <article className="character-card">
      <img src={character.image} alt={`Imagem de ${character.name}`} />
      <div className="character-content">
        <h3>{character.name}</h3>
        <p>
          <strong>Status:</strong> {character.status}
        </p>
        <p>
          <strong>Especie:</strong> {character.species}
        </p>
        <p>
          <strong>Origem:</strong> {character.origin.name}
        </p>
      </div>
    </article>
  )
}

export default CharacterCard
