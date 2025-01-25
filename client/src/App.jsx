import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import ClientView from "./pages/ClientView"
import ManagerView from "./pages/ManagerView"

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
})

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ClientView />} />
          <Route path="/manager" element={<ManagerView />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
