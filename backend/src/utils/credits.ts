let guestCredits = 3;

export const handleGuestCredits = () => {
  if (guestCredits <= 0) {
    throw new Error("Guest credits exhausted");
  }

  guestCredits--;
};

// reset (optional for testing)
export const resetGuestCredits = () => {
  guestCredits = 3;
};