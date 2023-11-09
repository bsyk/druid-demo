import "./App.css";
import React from "react";
import wikipediaIngestionSpec from "./wikipedia-ingestion-spec.json";
import netflowIngestionSpec from "./netflow-ingestion-spec.json";

function queryUrl({ query, s = "e-3h", e = "now", refresh }) {
  return `http://localhost:7101/api/v1/graph?q=${encodeURIComponent(
    query
  )}&s=${s}&e=${e}&refresh=${refresh}`;
}

const defaultWikipediaState = {
  query: "name,sum_added,:eq,\nisRobot,false,:eq,:and,\n:sum,\n(,isNew,),:by,\nAdded isNew=$(isNew),:legend",
  s: "e-12h",
  e: "2016-06-27T21:31:02.000Z",
}

const defaultNetflowState = {
  query : 'name,hist_packet_size,:eq,\n(,25,50,75,90,99,),:percentiles,\n5m,:trend,\npacket_size $(percentile)th percentile,:legend',
  e: '2023-11-08T17:36:00.000Z',
  s: 'e-3h'
}

function App() {
  const [query, setQuery] = React.useState(defaultWikipediaState.query);
  const [start, setStart] = React.useState(defaultWikipediaState.s);
  const [end, setEnd] = React.useState(defaultWikipediaState.e);
  const [message, setMessage] = React.useState('');
  const [refresh, setRefresh] = React.useState(Date.now());

  const loadWikipediaSample = () => {
    return loadSampleData(wikipediaIngestionSpec, defaultWikipediaState);
  };

  const loadNetflowSample = () => {
    return loadSampleData(netflowIngestionSpec, defaultNetflowState);
  };

  const useWikipediaQuery = () => {
    setQuery(defaultWikipediaState.query);
    setEnd(defaultWikipediaState.e);
    setStart(defaultWikipediaState.s);
  };

  const useNetflowQuery = () => {
    setQuery(defaultNetflowState.query);
    setEnd(defaultNetflowState.e);
    setStart(defaultNetflowState.s);
  }

  const loadSampleData = (ingestionSpec, defaultState) => {
    fetch("/druid/indexer/v1/task", {
      headers: {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json",
      },
      body: JSON.stringify(ingestionSpec),
      method: "POST",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => setMessage(
        <>
          <p>Submitted Task ID: ${data.task}</p>
          <p>Note: Metatdata about available datasources is only refreshed every 10 minutes. To see the datasource sooner, you can cycle the container using 'docker-compose restart atlas'</p>
        </>
        ))
      .then(() => {
        if(!!defaultState) {
          setQuery(defaultState.query);
          setEnd(defaultState.e);
          setStart(defaultState.s);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{display: 'flex'}}>
          <div style={{
              display: 'flex',
              'flex-direction': 'column',
            }}>
            <button onClick={useWikipediaQuery}>
              Use a Wikipedia Sample Query
            </button>
            <button onClick={useNetflowQuery}>
              Use a Netflow Sample Query
            </button>
          </div>
          <textarea
            rows="10"
            cols="50"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div style={{
              display: 'flex',
              'flex-direction': 'column',
              'max-width': '200px',
              'word-wrap': 'break-word',
            }}>
            <button onClick={loadWikipediaSample}>
              Load Wikipedia Sample Data into Druid
            </button>
            <button onClick={loadNetflowSample}>
              Load Netflow Sample Data into Druid
            </button>
            { message && <p>{message}</p> }
          </div>
        </div>
        <div style={{display: 'flex'}}>
          <div>
            <label>Start Date:</label>
            <input
              type="text"
              value={start}
              onChange={(event) => setStart(event.target.value)}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              type="text"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            />
          </div>
          <button onClick={() => setRefresh(Date.now())}>
            Refresh
          </button>
        </div>
        {query && (
          <img src={queryUrl({ query, s: start, e: end, refresh })} alt="atlas-chart" />
        )}
        {!query && <p>Enter a query</p>}
      </header>
    </div>
  );
}

export default App;
