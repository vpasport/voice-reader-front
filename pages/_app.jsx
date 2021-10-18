import '../styles/globals.css'
import Router from 'next/router';
import Header from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header>
        <title>voice reader</title>
      </Header>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
