import { useEffect, useState } from 'react';

const OrderShow  = ({ order }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    // pass in an empty array to ensure the interval is set only one time
    useEffect(() => {
        // this function will run every second
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        }

        // Call the function right away before waiting for the first interval to kick in
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            // Whenever we return a function from useEffect, that function will be run fi we are trying to navigate away from
            // the component, or if the component is going to be re-rendered and we provided dependencies for the useEffect
            // Since we provided an empty array for the dependencies, this function will only be called if we navigate away from the control
            // or if stop showing the control for some reason
            clearInterval(timerId);
        };

    }, [order]);   

    if( timeLeft < 0 ) {
        return <div>Order Expired</div>;
    }
    
    return <div>Time left to pay { timeLeft} seconds</div>;
};

OrderShow.getInitialProps = async (context, client) => {
    // use orderId as it is in the name of the file [orderId].js
    const { orderId } = context.query;
    const { data }  = await client.get(`/api/orders/${orderId}`);

    // This object will be merged with all the other props going to OrderShow
    // so can destructure it there
    return { order: data };
}

export default OrderShow;