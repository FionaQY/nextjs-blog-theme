import netlifyIdentity from `netlify-identity-widget`
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Protected() {
    const router = useRouter();
    useEffect(() => {
        const user = netlifyIdentity.currentUser();
        console.log({user});
        if (!user) {
            router.push("/")
        }
    }, [router])

    
    return (
        <div>
            "help"
        </div>
    )
}