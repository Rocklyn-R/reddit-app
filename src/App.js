import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { Subreddits } from './features/Subreddits/Subreddits';
import { SubredditsDropDown } from './features/Subreddits/subredditsDropDown/subredditsDropDown';


function App() {
  return (
    <div className="app">
      <Header />
      <div className='subreddits-dropdown'>
        <SubredditsDropDown />
      </div>
      <div className="container">
        <Subreddits />
        <Home />
        
      </div>
    </div>
  );
}

export default App;
