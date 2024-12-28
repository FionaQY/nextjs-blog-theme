import {useEffect} from "react"
import netlifyIdentity from "netlify-identity-widget"

const NetlifyIdentityProvider = () => {
    useEffect(() => {
        netlifyIdentity.init();
    }, []);

    const openLoginModal = () => {
        netlifyIdentity.open();
    };

    return (
        <div>
            <button onClick={openLoginModal}>Login/ Signup</button>
        </div>
    )
}

export default NetlifyIdentityProvider