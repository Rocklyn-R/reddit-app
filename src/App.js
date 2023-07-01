import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { Subreddits } from './features/Subreddits/Subreddits';


function App() {
  return (
    <div className="App">
      <Header />
      <div class="container">
        <Home />
        <Subreddits />
      </div>
    </div>
  );
}

export default App;
