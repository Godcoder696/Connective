import {Route} from 'react-router-dom';
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import { Switch } from 'react-router-dom';

export default function App(params) {
  return(
    <>
      <Switch>
        <Route path="/" exact><HomePage/></Route>
        <Route path="/chats" exact><ChatPage heading="ALL CHATS"/></Route>
        <Route path="/chats/search" exact><ChatPage heading="SEARCH"/></Route>
        <Route path="/chats/notification" exact><ChatPage heading="NOTIFICATION"/></Route>
        <Route path="/chats/createGroup" exact><ChatPage heading="CREATE NEW GROUP"/></Route>
        <Route path="/chats/about" exact><ChatPage heading="ABOUT"/></Route>
      </Switch>
      {/* <ChatPage></ChatPage> */}
    </>
  )
};
