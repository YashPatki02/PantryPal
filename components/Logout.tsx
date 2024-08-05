import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const Logout = () => {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            console.log("Logged out successfully!");
        } catch (error: Error | any) {
            alert(error.message);
            return;
        }
    };

    return (
        <Button variant="secondary" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default Logout;
