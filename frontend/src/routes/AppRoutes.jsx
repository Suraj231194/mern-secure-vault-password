import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import EntryForm from '../pages/EntryForm';
import ViewEntry from '../pages/ViewEntry';

import LandingPage from '../pages/LandingPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<PrivateRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/add" element={<EntryForm />} />
                    <Route path="/edit/:id" element={<EntryForm />} />
                    <Route path="/view/:id" element={<ViewEntry />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AppRoutes;
