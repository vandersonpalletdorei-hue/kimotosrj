const token = process.env.supabase;
if (token) {
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = Buffer.from(parts[1], 'base64').toString('utf8');
      console.log("Decoded Token Payload:", payload);
      const parsed = JSON.parse(payload);
      console.log("Issuer/Project info:", parsed.iss);
    } else {
      console.log("Not a JWT token format. Length:", token.length);
    }
  } catch (err) {
    console.error("JWT decode error:", err.message);
  }
} else {
  console.log("No 'supabase' env variable.");
}
