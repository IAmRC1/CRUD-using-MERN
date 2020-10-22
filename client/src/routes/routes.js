import {
  // eslint-disable-next-line max-len
  SignUp, SignIn, Verify, ChangePassword, ResetPassword, Main, Profile, AddAnimal, UpdateAnimal, ViewAnimal, UpdateProfile, NotFound,
} from '../components';

const routes = [
  {
    path: '/',
    component: Main,
    exact: true,
  },
  {
    path: '/login',
    component: SignIn,
    guest: true,
  },
  {
    path: '/register',
    component: SignUp,
    guest: true,
  },
  {
    path: '/verify',
    component: Verify,
    guest: true,
  },
  {
    path: '/resetpassword',
    component: ResetPassword,
    guest: true,
    exact: true,
  },
  {
    path: '/resetpassword/:token',
    component: ChangePassword,
    guest: true,
  },
  {
    path: '/home',
    component: Main,
    guest: false,
  },
  {
    path: '/profile',
    component: Profile,
    guest: false,
  },
  {
    path: '/add',
    component: AddAnimal,
    guest: false,
  },
  {
    path: '/update/:id',
    component: UpdateAnimal,
    guest: false,
  },
  {
    path: '/view/:id',
    component: ViewAnimal,
    guest: false,
  },
  {
    path: '/updateprofile',
    component: UpdateProfile,
    guest: false,
  },
  {
    path: '*',
    component: NotFound,
    guest: true,
    exact: true,
  },
];

export default routes;
