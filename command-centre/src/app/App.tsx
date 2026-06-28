import "../styles/App.css";
import Providers from "./Providers";
import Router from "./Router";

function App() {
  return (
    <>
      <Providers>
        <Router></Router>
      </Providers>
    </>
  );
}

export default App;
