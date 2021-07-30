import React, { useState, useRef, useEffect } from 'react';
import { login, logout, createPixelArt } from '../utils';
//routes
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"

import getConfig from '../config'

const { networkId } = getConfig(process.env.NODE_ENV || 'development')


const HomePage = () => {

  const [posts, setPosts] = useState([]);


  function shortenContent(text) {
    let max = 150;
    return text && text.length > max ? text.slice(0, max).split(' ').slice(0, -1).join(' ') + "..." : text
  }

  function loadMore() {
    console.log("load more~:  ", posts.length);
    window.contract.getEntities({ from: posts.length, to: posts.length + 3 }).then((res) => {
      setPosts(posts.concat(res));
      console.log("more entities:", posts);
    });
  }

  useEffect(() => {
    document.title = "Pixel Me - Home of pixel art on NEAR"
    window.contract.getEntities({ from: 0, to: 6 }).then((res) => {
      setPosts(res);
      console.log("1 set entities:", res);
    });
  }, []);


  return (
    <div id="homepage">
      <div id="home_top_images" className="row">

        <div id="header_top_intro">
          <h2 className=" mb-4 font-italic"> Discover, Create and Share your pixel arts to the world! 🌎 </h2>
          <h5>Powered by NEAR  blockchain 🚀🚀🚀</h5>
        </div>



        <div id="home_list_image" className="row" data-masonry='{"percentPosition": true }'>
          {
            posts.length > 0 ? 
            posts.map(entity => (
              <div className="col-md-4" key={Math.random()}>

                <div className="card" href={`/v/${entity.url}`}>
                  <a href={`/v/${entity.url}`}>
                    <img className="card-img-top" src={entity.image} alt={`entity.title`} />
                  </a>
                  <div className="card-body">
                    <h5 className="card-title border-bottom">{entity.title}</h5>
                    <div className="author"> <span>{entity.author} </span></div>
                    <p className="card-text"> {shortenContent(entity.content)} </p>
                  </div>
                </div>

              </div>
            ))
            : <a href="/create" className="btn btn-first-create">Be the first artist - Create your own pixel art now!</a>
  
          }

          <button id="btn-home-load-more" onClick={() => loadMore()}>View more</button>
        </div>
      </div>
    </div>
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


export default HomePage;


