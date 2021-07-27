import 'regenerator-runtime/runtime'
import React from 'react'
window.React = React
import { login, logout, createPixelArt } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

//routes
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//pages 
import CreateImagePage from './pages/create-image';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom.min'
import HomePage from './pages/homepage'
import ViewImagePage from './pages/view-image'

export default function App() {
  // use React Hooks to store greeting in component state
  const [greeting, setGreeting] = React.useState()

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // in this case, we only care to query the contract when signed in
      if (window.walletConnection.isSignedIn()) {
        console.log("user signed in ");
        // // window.contract is set by initContract in index.js
        // window.contract.getGreeting({ accountId: window.accountId })
        //   .then(greetingFromContract => {
        //     setGreeting(greetingFromContract)
        //   })
      }
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h3 style={{textAlign:'center'}}>
          Singin with your NEAR account!
        </h3>

        <p style={{ textAlign: 'center', marginTop: '1.5em' }}>
          <button onClick={login}> Start to discover and create pixel arts</button>
        </p>

        <iframe style={{margin:'0 auto', display:'block'}} src="https://giphy.com/embed/yENldFXGfK0jDERFT6" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/wedomedias-yENldFXGfK0jDERFT6"></a></p>
 
      </main>
    )
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>

      <div className="main-content container">

        <BrowserRouter>

          <header>

            <h2 className="logo">
              <a href="/">PIXEL ME</a>
            </h2>


            <div className="header-right">

              <nav className="header-menu-right">
                <Link to="/">Browse</Link>
                <Link to="/create">Create</Link>
                <a className="link" style={{color:"red"}} onClick={logout}><i className="fas fa-sign-out-alt"></i> Sign out  </a>
              </nav>
            </div>

          </header>


          <Switch>
            <Route path="/v">
              <ViewImagePage />
            </Route>

            <Route path="/create">
              <CreateImagePage />
            </Route>

            <Route path="/">
              <HomePage />
            </Route>
          </Switch>

        </BrowserRouter>
      </div>
      {/* main layout */}




      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'setGreeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
