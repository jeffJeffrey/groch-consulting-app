import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import { HashRouter, Route, Routes } from "react-router-dom";
import { defaultNavItems } from "./components/NavLinks";
import { useLocalStorage } from "usehooks-ts";
import { AuthProvider } from "./context";

function App() {
  const [token] = useLocalStorage<string | null>("token", null);
  if (!token) return <AuthPage />;
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {defaultNavItems.map((route) => (
            <Route
              key={route.href}
              path={route.href}
              element={<Layout>{route.element}</Layout>}
            />
          ))}
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
