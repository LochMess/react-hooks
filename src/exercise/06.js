// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     // this.state = {hasError: false}
//     this.state = {hasError: false, error: null}
//   }

//   static getDerivedStateFromError(error) {
//     return {hasError: true, error}
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div role="alert">
//           There was an error:{' '}
//           <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
//         </div>
//       )
//     }

//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: {},
    error: {},
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({status: 'resolved', pokemon: pokemonData})
      },
      error => {
        setState({status: 'rejected', error})
      },
    )
  }, [pokemonName])

  if (state.status === 'rejected') throw state.error
  return state.status === 'resolved' ? (
    <PokemonDataView pokemon={state.pokemon} />
  ) : state.status === 'pending' ? (
    <PokemonInfoFallback name={pokemonName} />
  ) : (
    'Submit a pokemon'
  )
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          resetKeys={[pokemonName]}
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
