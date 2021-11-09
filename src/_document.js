import Document, { Head, Main, NextScript } from 'next/document';
// Import styled components ServerStyleSheet
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Step 1: Create an instance of ServerStyleSheet
    const sheet = new ServerStyleSheet();

    // Step 2: Retrieve styles from components in the page
    const page = renderPage((App) => (props) =>
      sheet.collectStyles(<App {...props} />),
    );

    // Step 3: Extract the styles as <style> tags
    const styleTags = sheet.getStyleElement();

    // Step 4: Pass styleTags as a prop
    return { ...page, styleTags };
  }

  render() {
    return (
      <html prefix="og: https://ogp.me/ns#">
        <Head>
          <title>Status digitale tjenester</title>
          {/* Step 5: Output the styles in the head  */}
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <meta name="title" content="Navstatus" />
          <meta name="description" content="" />


          {/* <!-- Open Graph / Facebook --> */}
          <meta property="og:site_name" content="Status Nav digitale tjenester" />
          <meta property="og:title" content="Status Nav digitale tjenester" />
          <meta property="og:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
          <meta property="og:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
          <meta property="og:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
          <meta property="og:type" content="website" />


          {/* <!-- Twitter --> */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content="https://portal.labs.nais.io/Dashboard/Privatperson" />
          <meta property="twitter:title" content="Navstatus" />
          <meta property="twitter:description" content="Status Nav digitale tjenester er en oversiktsside for Navs ulike tjenester til borgere, arbeidsgivere og samarbeidspartnere." />
          <meta property="twitter:image" content="https://www.nav.no/dekoratoren/media/nav-logo-red.svg" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}