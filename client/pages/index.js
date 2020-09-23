import axios  from 'axios';

const LandingPage = ({ currentUser }) => {
    //Log current user coming fro, getInitialProps 
    console.log(currentUser)
    return <h1>Landing Page</h1>;
}

LandingPage.getInitialProps = async ({ req }) => {
    
    if(typeof window === 'undefined') {
        //we are on the server!
        //requests should be made to http://SERVICENAME.NAMESPACE.svc.cluster.local{api-route}
        const { data }  = await axios.get(            
            'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
            {
                headers: req.headers                
            }            
        );
        return data;
        
    } else {
        //we are in the browser!
        //request can be made with a base url of ''
        const { data }  = await axios.get('/api/users/currentuser');
        return data;
    }
    console.log('I WAS EXECUTED');
    return {};
};

export default LandingPage;