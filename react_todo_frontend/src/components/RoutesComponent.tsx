import { Route, Routes } from 'react-router-dom';
// CORE PAGES =====================
import TodoPage from '../pages/TodoPage';
// UTILITY PAGES ===================
import SigninPage from '../pages/SigninPage';
import SignupPage from '../pages/SignupPage';
import NotFoundPage from '../pages/utility/NotFoundPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path='/' element={<TodoPage />} />
      <Route path='/Home' element={<TodoPage />} />
      <Route path='/Login' element={<SigninPage />} />
      <Route path='/Signup' element={<SignupPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default RoutesComponent;
