import { useEffect, useState } from "react";
import netlifyIdentity from "netlify-identity-widget";

const NetlifyIdentityProvider = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        netlifyIdentity.init();
    }, []);

    const openLoginModal = () => {
        netlifyIdentity.open();
    };

    if (!hydrated) {
        return null;
    }

    return (
        <div>
            <button onClick={openLoginModal}>Login/ Signup</button>
        </div>
    );
};

export default NetlifyIdentityProvider;
