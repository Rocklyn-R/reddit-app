import { useSelector } from 'react-redux';
import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { Subreddits } from './features/Subreddits/Subreddits';
import { SubredditsDropDown } from './features/Subreddits/subredditsDropDown/subredditsDropDown';
import { isCustomPostsError, isError } from './store/redditSlice';
import Card from './components/Card';


function App() {
  const error = useSelector(isError);
  const customPostsError = useSelector(isCustomPostsError);

  if (error) {
    return <Card className='error-message'>Reddit server is busy. Try again in a minute.</Card>
    
  } else {
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

}

export default App;
