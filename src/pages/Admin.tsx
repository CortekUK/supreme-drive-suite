import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full shadow-metal bg-card/50 backdrop-blur">
        <h1 className="text-3xl font-display font-bold mb-6 text-gradient-metal text-center">
          Admin Portal
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Authentication will be implemented in the next phase. For now, you can access admin features once logged in.
        </p>
        <Link to="/">
          <Button className="w-full gradient-accent shadow-glow">
            Back to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default Admin;
