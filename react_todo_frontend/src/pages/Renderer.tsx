import 'bootstrap/dist/css/bootstrap.min.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from '../components/NavBar';
import RoutesComponent from '../components/RoutesComponent';

export const Renderer = () => {
  return (
    <HelmetProvider>
      <Helmet
        titleTemplate='Rails Todo | %s'
        defaultTitle='Rails Todo | Home'
      />
      <Router>
        <div
          className='maxHeight'
          style={{
            backgroundColor: 'black',
            background: 'radial-gradient(#262626, #000)',
          }}>
          <NavBar />
          <RoutesComponent />
        </div>
      </Router>
    </HelmetProvider>
  );
};
