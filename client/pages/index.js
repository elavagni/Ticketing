import buildHttpClient  from '../api/build-http-client';

const LandingPage = ({ currentUser }) => {
    //currentUser is comming from getInitialProps 
    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1> 
    
}

LandingPage.getInitialProps = async context => {
    const httpClient = buildHttpClient(context);
    const { data } = await httpClient.get('/api/users/currentuser');

    return data;
};

export default LandingPage;