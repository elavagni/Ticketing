import buildHttpClient  from '../api/build-http-client';

const LandingPage = ({ currentUser }) => {
    //Log current user coming fro, getInitialProps 
    console.log(currentUser)
    return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async context => {
    const httpClient = buildHttpClient(context);
    const { data } = await httpClient.get('/api/users/currentuser');

    return data;
};

export default LandingPage;