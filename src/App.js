import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'Defi_Theory';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_POKEMONS = [
  "https://img.pokemondb.net/artwork/large/pikachu.jpg", 
  "https://img.pokemondb.net/artwork/large/charizard.jpg", 
  "https://img.pokemondb.net/artwork/large/blastoise.jpg", 
  "https://img.pokemondb.net/artwork/large/venusaur.jpg"
]

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null)
  const [inputValue, setInputValue] = useState('');
  const [pokemonList, setPokemonList] = useState([]);


  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const sendPokemon = async () => {
    if (inputValue.length > 0) {
      console.log('Pokemon link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendPokemon();
        }}
      >
        <input   
          type="text"
          placeholder="Enter pokemon link!"
          value={inputValue}
          onChange={onInputChange} 
        />
        <button type="submit" className="cta-button submit-pokemon-button">Submit</button>
      </form>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon) => (
          <div className="pokemon-item" key={pokemon}>
            <img src={pokemon} alt={pokemon} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching POKEMON list...');
      
      // Call Solana program here.
  
      // Set state
      setPokemonList(TEST_POKEMONS);
    }
  }, [walletAddress]);


  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container" style={{color: 'white'}}>
          <p className="header">🖼 POKEMON Portal</p>
          <p className="sub-text">
            View your POKEMON collection in the metaverse ✨
          </p>
          {walletAddress ? walletAddress : ""}
          {walletAddress ? renderConnectedContainer() : renderNotConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
