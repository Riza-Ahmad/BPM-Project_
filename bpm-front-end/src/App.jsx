import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Suspense } from "react";
import ProtectedRoute from "./components/util/ProtectedRoute";
import Header from "./components/backbone/Header";
import Footer from "./components/backbone/Footer";
import ScrollToTop from "./components/part/ScrollToTop";
import routeList from "./components/util/RouteList";
import "./App.css";

function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="d-flex flex-column min-vh-100">
      {!isLoginPage && <Header />}
      <main className="flex-grow-1">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routeList.map((route, index) => {
              if (route.protected) {
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                  />
                );
              }
              return (
                <Route key={index} path={route.path} element={route.element} />
              );
            })}
          </Routes>
        </Suspense>
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
    </Router>
  );
}

export default App;
