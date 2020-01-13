import React from "react";
import App from "next/app";
import Head from "next/head";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <script src="https://js.stripe.com/v3/" />
        </Head>
        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
