import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useCharacters } from '../contexts/CharacterContext'

const validationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('O nome do personagem e obrigatorio.')
    .min(2, 'Digite ao menos 2 caracteres para a busca.'),
  status: yup.string().oneOf(['', 'alive', 'dead', 'unknown']),
  species: yup
    .string()
    .trim()
    .max(30, 'A especie deve possuir no maximo 30 caracteres.'),
})

function SearchForm() {
  const { filters, searchCharacters } = useCharacters()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: filters,
    resolver: yupResolver(validationSchema),
  })

  function onSubmit(values) {
    searchCharacters({
      name: values.name.trim(),
      status: values.status,
      species: values.species.trim(),
    })
  }

  return (
    <section className="card">
      <h2>Busca de Personagens</h2>
      <form className="search-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <label htmlFor="name">Nome do personagem *</label>
        <input
          id="name"
          type="text"
          placeholder="Ex.: Rick"
          {...register('name')}
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <p className="field-error">{errors.name.message}</p>}

        <label htmlFor="status">Status</label>
        <select id="status" {...register('status')}>
          <option value="">Todos</option>
          <option value="alive">Vivo</option>
          <option value="dead">Morto</option>
          <option value="unknown">Desconhecido</option>
        </select>

        <label htmlFor="species">Especie</label>
        <input
          id="species"
          type="text"
          placeholder="Ex.: Human"
          {...register('species')}
          aria-invalid={Boolean(errors.species)}
        />
        {errors.species && <p className="field-error">{errors.species.message}</p>}

        <button type="submit" disabled={isSubmitting}>
          Buscar
        </button>
      </form>
    </section>
  )
}

export default SearchForm
