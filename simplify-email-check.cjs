const fs = require('fs');

let content = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

// Replace the handleCheckEmail function with a simpler version
const oldFunction = `  const handleCheckEmail = async (e: React.FormEvent) => {
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
  };`;

const newFunction = `  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Show password reset form directly
    setVerifiedEmail(resetEmail.trim());
    setShowPasswordResetForm(true);
    setShowForgotPassword(false);
  };`;

content = content.replace(oldFunction, newFunction);

fs.writeFileSync('src/pages/Auth.tsx', content, 'utf8');
console.log('Simplified email checking - now just validates format');
