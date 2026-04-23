function ErrorMessage({ message }) {
  return (
    <section className="card error-box" role="alert">
      <h2>Erro na consulta</h2>
      <p>{message}</p>
    </section>
  )
}

export default ErrorMessage
