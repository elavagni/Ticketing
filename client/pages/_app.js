import 'bootstrap/dist/css/bootstrap.css';
import builHttpClient from '../api/build-http-client';
import Header from '../components/header';

const AppComponent =  ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} /> 
        </div>     
    );
};

//The arguments provided to the getInitialProps function are going to be different if we are in 
//a page versus when we are in a component.
AppComponent.getInitialProps = async (appContext) => {
    const httpClient = builHttpClient(appContext.ctx);
    const { data } = await httpClient.get('/api/users/currentuser');
    let pageProps = {};
    
    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
        console.log(pageProps);
    }
    return {
        pageProps,    
        currentUser: data.currentUser
        //we could also do ...data here
    }
    
}

export default AppComponent;