import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/admin");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged in successfully");
  };

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailToCheck = resetEmail.trim().toLowerCase();

      // Check if user exists by querying profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .ilike('email', emailToCheck);

      setLoading(false);

      if (error) {
        console.error("Error checking email:", error);
        toast.error("Error checking email");
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Email not found in our system");
        return;
      }

      // Email exists, show password reset form
      setVerifiedEmail(data[0].email);
      setShowPasswordResetForm(true);
      setShowForgotPassword(false);
    } catch (error) {
      setLoading(false);
      console.error("Exception:", error);
      toast.error("Error checking email");
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (resetPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length
    if (resetPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Get the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', verifiedEmail)
        .single();

      if (userError || !userData) {
        setLoading(false);
        toast.error("Error finding user");
        return;
      }

      // Update password using Supabase admin API
      // Note: This requires creating a Supabase function
      const { data, error } = await supabase.functions.invoke('update-password', {
        body: { userId: userData.id, newPassword: resetPassword }
      });

      setLoading(false);

      if (error) {
        toast.error("Error updating password. Please contact admin.");
        return;
      }

      toast.success("Password changed successfully! You can now login with your new password.");
      setResetPassword("");
      setConfirmPassword("");
      setShowPasswordResetForm(false);
      setResetEmail("");
      setVerifiedEmail("");
    } catch (error) {
      setLoading(false);
      toast.error("Error updating password");
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowPasswordResetForm(false);
    setResetEmail("");
    setResetPassword("");
    setConfirmPassword("");
    setVerifiedEmail("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full shadow-metal bg-card/50 backdrop-blur">
        <h1 className="text-3xl font-display font-bold mb-6 text-gradient-metal text-center">
          {showPasswordResetForm ? "Reset Your Password" : showForgotPassword ? "Forgot Password" : "Admin Login"}
        </h1>

        {!showForgotPassword && !showPasswordResetForm && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showLoginPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gradient-accent shadow-glow"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
              >
                Don't remember your password?
              </button>
            </div>
          </form>
        )}

        {showForgotPassword && !showPasswordResetForm && (
          <div>
            <button
              onClick={handleBackToLogin}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-accent shadow-glow"
                disabled={loading}
              >
                {loading ? "Checking..." : "Continue"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                We'll check if this email exists in our system.
              </p>
            </form>
          </div>
        )}

        {showPasswordResetForm && (
          <div>
            <button
              onClick={handleBackToLogin}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </button>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Setting new password for: <span className="text-foreground font-medium">{verifiedEmail}</span>
              </p>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showResetPassword ? "text" : "password"}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showResetPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-accent shadow-glow"
                disabled={loading}
              >
                {loading ? "Updating password..." : "Update Password"}
              </Button>
            </form>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Auth;
