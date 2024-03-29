import { useSelector } from 'react-redux';
import './App.css';
import { Header } from './features/Header/Header';
import { Home } from './features/Home/Home';
import { Subreddits } from './features/Subreddits/Subreddits';
import { SubredditsDropDown } from './features/Subreddits/subredditsDropDown/subredditsDropDown';
import { isError } from './store/redditSlice';
import Card from './components/Card';
import { CustomSubredditsDropDown } from './features/Subreddits/subredditsDropDown/customSubredditsDropDown/customSubredditsDropDown';
import { subredditsError } from './store/subredditsSlice';


function App() {
  const redditError = useSelector(isError);
  const subError = useSelector(subredditsError);

  if (redditError && subError) {
    return <Card className='error-message'>Reddit server is busy. Try again in a minute.</Card>
    
  } else {
    return (
    <div className="app">
      <Header />
      <div className='subreddits-dropdown'>
        <CustomSubredditsDropDown/>
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
