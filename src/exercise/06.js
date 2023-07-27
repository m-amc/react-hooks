// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

import {ErrorBoundary} from 'react-error-boundary'

const STATUS = {
  idle: 'idle',
  pending: 'request started',
  resolved: 'request successful',
  rejected: 'request failed',
}

// class ErrorBoundary extends React.Component {
//   state = {error: null}
//   static getDerivedStateFromError(error) {
//     return {
//       error,
//     }
//   }
//   render() {
//     const {error} = this.state

//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }
//     return this.props.children
//   }
// }

// resetErrorBoundary comes free with the react-error-boundary library.  It will reset the state for us
const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      (This is the error fallback) There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

// Single State
function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: STATUS.idle,
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return

    // For this app, we don't need the other state and so the setState did not include ...state
    setState({
      status: STATUS.pending,
    })

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({
          pokemon: pokemonData,
          status: STATUS.resolved,
        })
      })
      .catch(error => {
        setState({
          status: STATUS.rejected,
          error: error,
        })
      })
  }, [pokemonName])

  if (status === STATUS.rejected) {
    // this will be handled by our error boundary
    throw error
  }

  if (status === STATUS.idle) return 'Submit a pokemon'
  if (status === STATUS.pending)
    return <PokemonInfoFallback name={pokemonName} />

  return <PokemonDataView pokemon={pokemon} />
}

// function PokemonInfo({pokemonName}) {
//   const [pokemon, setPokemon] = React.useState(null)
//   const [error, setError] = React.useState(null)
//   const [status, setStatus] = React.useState(STATUS.idle)

//   React.useEffect(() => {
//     if (!pokemonName) return

//     // with the use of the status state, we don't need tor reset the pokemon and error state! Less things to worry about.
//     // setPokemon(null)
//     // setError(null)
//     setStatus(STATUS.pending)

//     fetchPokemon(pokemonName)
//       .then(pokemonData => {
//         setPokemon(pokemonData)
//         setStatus(STATUS.resolved)
//       })
//       .catch(error => {
//         setError(error)
//         setStatus(STATUS.rejected)
//       })
//   }, [pokemonName])

//   if (status === STATUS.rejected) {
//     return (
//       <div role="alert">
//         There was an error:{' '}
//         <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
//       </div>
//     )
//   }

//   if (status === STATUS.idle) return 'Submit a pokemon'
//   if (status === STATUS.pending)
//     return <PokemonInfoFallback name={pokemonName} />

//   return <PokemonDataView pokemon={pokemon} />
// }

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/* Using key in the ErrorBoundary will help the app recover from the error state. For example, after displaying the error, our app should be able to function properly when a valid pokemon name is provided after */}
        {/* <ErrorBoundary FallbackComponent={ErrorFallback} key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div> */}

        {/* we don't need the key prop here because we are now using the resetErrorBoundary prop in the ErrorFallback component */}
        {/* resetKeys is an array of values that when changed the error boundary will reset itself */}
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={handleReset}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
