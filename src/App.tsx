import "./styles/App.css";
import { ApolloProvider } from '@apollo/client';
import Routers from "./routes"; // Double-check this path
import client from "./utils/apolloClientConnect";



function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Routers />
      </ApolloProvider>
    </>
  );
}

export default App;
